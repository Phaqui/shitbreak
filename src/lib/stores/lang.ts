import { browser } from '$app/env';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

type Optional<T> = T | null;

type LocaleStruct = {
    // e.g. "en-US" or "no-NB", to be used in Intl-calls
    raw: string;
    autodetected: boolean;
}

class Inner {
    public _struct: LocaleStruct;
    private _humanreadable: Optional<string>;
    private _autodetected: string;

    constructor();
    constructor(raw: string);
    constructor(arg?: any) {
        this._autodetected = "";
        if (!browser) {
            return;
        }
        this._humanreadable = null;
        this._autodetected = window.navigator.language;
        if (arg === undefined) {
            // new default
            this._struct = { raw: this._autodetected, autodetected: true };
        } else {
            this._struct = { raw: arg, autodetected: false };
        }
    }

    get lang() {
        if (!browser) return "";
        return this.raw.split('-')[0];
    }

    set lang(val: string) {
        this._struct.raw = val;
        this._struct.autodetected = val === "";
    }

    get raw() {
        return this._struct.raw;
    }

    set(locale: string) {
        if (locale === "") {
            this._struct.raw = this._autodetected;
            this._struct.autodetected = true;
        } else {
            this._struct.raw = locale;
            this._struct.autodetected = false;
        }
        this._humanreadable = null;
    }

    get humanreadable() {
        if (this._humanreadable !== null) {
            return this._humanreadable;
        }

        this._humanreadable = get_humanreadable(this._struct.raw);
        return this._humanreadable;
    }

    get autodetected() {
        return this._struct.autodetected;
    }
};

class Locale {
    private _store: Writable<Inner>;

    constructor() {
        if (!browser) {
            this._store = writable(new Inner());
            return;
        }
        this._store = writable(new Inner(), (set) => {
            let ls_value = window.localStorage.getItem('locale');
            
            // TODO this should be temporary
            if (ls_value === "[object Object]") {
                console.debug("Locale: localStorage error, fixing it.");
                ls_value = '';
                window.localStorage.setItem('locale', ls_value);
            }
            if (ls_value !== null) {
                set(new Inner(ls_value));
            }
        });
    }

    get subscribe() { return this._store.subscribe; }
    /*
    get language() {
        let inner: Optional<LocaleStruct>;
        this._store.subscribe(val => inner = val)();
        return inner.raw.split('-')[0];
    }
    */

    public set(locale: string) {
        if (locale.includes("[object Object]")) {
            const errmsg = "lang.ts:Locale.set(): given locale has '[object Object]";
            console.error(errmsg);
            throw new Error(errmsg);
        }
        this._store.update(inner => {
            inner.set(locale);
            return inner;
        });
        window.localStorage.setItem('locale', locale);
    }
}

export const locale = new Locale();

function get_humanreadable(locale: string) {
    if (locale === null || locale === "") {
        return "(no language given)";
    }

    // browser only (depends on Intl)
    const [language, subtag] = locale.split('-', 2);
    const language_name = new Intl.DisplayNames([locale], { type: 'language' });
    switch (language.toLowerCase()) {
        case 'en':
            const region_name = new Intl.DisplayNames([locale], { type: 'region' });
            return language_name.of('en') + " as spoken in " + region_name.of(subtag);
        case 'no':
            let written_lang: string;
            if (subtag === 'nb') {
                written_lang = 'Bokmål';
            } else if (subtag === 'nn') {
                written_lang = 'Nynorsk';
            } else {
                written_lang = 'UKJENT NORSK SKRIFTSPRÅK';
            }
            return `Norsk (${written_lang})`;
        default:
            return 'ERROR: language not supported';
    }
}

