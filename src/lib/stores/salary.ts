import { LocalStorageStore } from '$lib/stores/_localstoragestore';

import { derived } from 'svelte/store';

export const hourly = new LocalStorageStore<number>("hourly_salary", Number);
export const config_ok = derived(hourly, hourly => hourly > 0);

export const currency = new LocalStorageStore<string>("currency", String);

