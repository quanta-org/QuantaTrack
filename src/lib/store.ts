import { writable } from 'svelte/store';

export let toast = writable(JSON.stringify({ message: '', success: 'false', show: 'false' }));
