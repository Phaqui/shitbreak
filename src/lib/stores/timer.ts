import { LocalStorageStore } from '$lib/stores/_localstoragestore';

export const start_time = new LocalStorageStore<number>('start_time', Number);
