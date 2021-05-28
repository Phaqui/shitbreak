import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

type Optional<T> = T | null;

export class LocalStorageStore<T> {
    private _store: Writable<Optional<T>>;

    constructor(private key: string, type_parser: (val: string) => T) {
        this._store = writable<Optional<T>>(null, (set) => {
            let x = window.localStorage.getItem(key);
            if (x !== null) {
                set(type_parser(x));
            }
        });
    }

    get subscribe() { return this._store.subscribe; }

    public set(value: Optional<T>) {
        if (value === null) {
            window.localStorage.removeItem(this.key);
        } else {
            window.localStorage.setItem(this.key, value.toString());
        }

        this._store.set(value);
    }
}
