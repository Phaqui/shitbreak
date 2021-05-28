import { browser } from '$app/env';
import { writable } from 'svelte/store';
import { format_duration } from '$lib/dt_utils';
import type { Writable } from 'svelte/store';

type ShitStruct = {
    // when the shit took place
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;

    // how long the shit lasted for (in seconds)
    duration: number;

    // hourly salary (gross) at the time of this entry
    hourly_salary: number;
};

class Shit {
    public hourly_salary: number;
    private _shit: ShitStruct;

    constructor(shit: ShitStruct);
    constructor(duration: number);
    constructor(arg: ShitStruct | number) {
        if (Number.isFinite(arg)) {
            // todo: construct a Shit object from just a duration
            // ... but do we need this?
            throw new Error("Shit::constructor() unsupported arg (TODO maybe)")
        } else {
            this._shit = arg as ShitStruct;
        }
    }

    get duration() {
        return this._shit.duration;
    }

    get date() {
        const { year: yr, month, day, hour: hr, minute: min, second: s } = this._shit;
        return new Date(yr, month, day, hr, min, s);
    }

    get formatted_date() {
        const opts: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        };

        return this.date.toLocaleDateString('no-NB', opts);
    }

    get earning() {
        return this._shit.hourly_salary / 3600 * this._shit.duration;
    }

    get formatted_duration() {
        let format_opts = {
            hour_str: ' hr',
            min_str: ' min',
            sec_str: ' s'
        };
        return format_duration(this._shit.duration, format_opts);
    }

    get inner_shit() {
        return this._shit;
    }

    // used by the ShitEntries to get the key for this shit
    get_key() {
        const s = this._shit;
        return [s.year, s.month, s.day, s.hour, s.minute, s.second];
    }
}

const DB_NAME = 'shitbreak.phaqui.workers.dev';
const DB_OBJSTORE_NAME = 'shits';

class ShitEntries {
    public subscribe: any;
    private db: IDBDatabase;
    private _store_set: any;
    private _store_update: any;

    private _dbready: Promise<IDBDatabase>;

    constructor() {
        if (!browser) {
            return;
        }
        let store = writable<Array<Shit>>([]);

        let resolve_dbready: (val: unknown) => void;
        let reject_dbready: (val: unknown) => void;
        this._dbready = new Promise((resolve, reject) => {
            resolve_dbready = resolve;
            reject_dbready = reject;
        });

        let request = window.indexedDB.open(DB_NAME);
        request.onupgradeneeded = (ev: any) => {
            console.debug("onupgradeneeded - time to create the schema");
            this.db = ev.target.result;
            resolve_dbready(this.db);

            this.db.onclose = (ev) => {
                console.warn("database connection closed, reloading page...");
                window.location.reload();
            };
            this.db.onerror = (ev) => {
                console.warn("database error detected, pls reload page");
            };

            // SCHEMA
            // since my "key" is composed of all of the individual date
            // components, this is akin to having a primary key of of more
            // than one column
            let primary_key = [
                "year", "month", "day", "hour", "minute", "second"
            ];
            
            let idb_objstore = this.db.createObjectStore(DB_OBJSTORE_NAME,
                                                    { keyPath: primary_key });
            
            // index on "year" to allow quick searches for the same year
            idb_objstore.createIndex("year", "year", { unique: false });

            // if we want to do anything with the newly created store
            /*
            idb_objstore.transaction.oncomplete = (ev) => {
                let objStore = this.db.transaction("shits", "readwrite").objectStore("shits");
                // do something with objStore
            };
            */
        };

        request.onsuccess = (ev: any) => {
            this.db = ev.target.result;
            resolve_dbready(this.db);
            let transaction = this.db.transaction(DB_OBJSTORE_NAME);
            let objstore = transaction.objectStore(DB_OBJSTORE_NAME);
            objstore.getAll().onsuccess = (ev) => {
                let shit_struct_array = ev.target.result;
                let shit_obj_array = shit_struct_array.map(
                    (shit_struct: ShitStruct) => new Shit(shit_struct));
                store.set(shit_obj_array);
            };
        };

        request.onerror = (ev: any) => {
            reject_dbready(null);
        };


        this.subscribe = store.subscribe;
        this._store_update = store.update;
    }

    async getdb() {
        return await this._dbready;
    }

    async add(
      duration: number,
      hourly_salary: number,
      when: Date | null = null
    ) {
      return new Promise((resolve, reject) => {
        const now = when instanceof Date ? when : new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const day = now.getDate();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();
        let new_shit_struct: ShitStruct = {
            year, month, day, hour, minute, second, duration, hourly_salary
        };
        let request = this.db.transaction("shits", "readwrite")
                             .objectStore("shits")
                             .add(new_shit_struct);
        request.onsuccess = (ev: any) => {
            this._store_update(val => [...val, new Shit(new_shit_struct)]);
            resolve(ev.target.result);
        };
        
        request.onerror = (ev: any) => {
            reject(request.error);
        };
      });
    }

    async update(shit: Shit) {
        // shit is unique by it's key (the date (with time))
        // so, find the shit referenced by `shit`, and update their
        // values for duration
        return new Promise((resolve, reject) => {
            let obj_store = this.db.transaction("shits", "readwrite")
                                   .objectStore("shits");
            let request = obj_store.get(shit.get_key());
            request.onerror = (ev) => {
                reject(ev);
            };
            request.onsuccess = (ev) => {
                const idb_obj = ev.target.result as ShitStruct;

                // update the object
                idb_obj.duration = shit.duration;

                // finally save it to the db
                let update_request = obj_store.put(idb_obj);
                update_request.onerror = (ev) => {
                    reject(ev);
                };
                update_request.onsuccess = (ev) => {
                    this._store_update((store_shits: Array<Shit>) => {
                        const idx = store_shits.findIndex((s: Shit) => {
                            // this requires the argument to be the same
                            // object
                            return s.inner_shit === shit.inner_shit;
                        });

                        // update the shit stored in the store
                        store_shits[idx]._shit.duration = idb_obj.duration;
                        return store_shits;
                    });
                    resolve(true);
                };
            };
        });
    }

    async del(shit: Shit) {
        return new Promise((resolve, reject) => {
            let request = this.db.transaction("shits", "readwrite")
                                .objectStore("shits")
                                .delete(shit.get_key());
            request.onerror = (ev) => {
                reject(ev);
            };
            request.onsuccess = (_ev) => {
                this._store_update((store_shits: Array<Shit>) => {
                    const idx = store_shits.findIndex((s: Shit) => {
                        return s.inner_shit === shit.inner_shit;
                    });
                    if (idx === -1) {
                        throw new Error("couldn't find that shit in the store");
                    } else {
                        store_shits.splice(idx, 1);
                        return store_shits;
                    }
                });
                resolve(true);
            }
        });
    }

    async get_yearly_total(year: number) {
        // just for sanity
        if (!Number.isInteger(year) || year < 1900 || year > 3000) {
            throw new Error("not a year");
        }

        let db: IDBDatabase;
        try {
            db = await this.getdb();
        } catch (err) {
            console.error("ShitStruct.get_yearly_total(): no db (rejected)");
            throw new Error("ShitEntries.get_yearly_total(): no db");
        }

        console.assert(db !== undefined, "get_yearly_total: db is undefined"); 

        return new Promise((resolve, reject) => {
            const store = db.transaction(DB_OBJSTORE_NAME)
                            .objectStore(DB_OBJSTORE_NAME);
            const limits = IDBKeyRange.bound(year, year, false, false);
            let request = store.index("year").openCursor(limits);
            let array = [];
            request.onsuccess = (ev) => {
                let cursor = ev.target.result;

                if (cursor) {
                    array.push(new Shit(cursor.value as ShitStruct));
                    cursor.continue();
                } else {
                    let duration = 0;
                    let earnings = 0;

                    for (let se of array) {
                        duration += se.duration;
                        earnings += se.earning;
                    }

                    resolve( { duration, earnings });
                }
            };

            request.onerror = (ev) => {
                reject(request.error);
            };
        });
    }
}

export const shit_entries = new ShitEntries() as unknown as Writable<Shit>;
