import { writable } from 'svelte/store';
import { browser } from '$app/environment';

let persistedUser = browser && localStorage.getItem('user');
export let user = writable(persistedUser ? JSON.parse(persistedUser) : '');

export let toast = writable(JSON.stringify({ message: '', success: 'false', show: 'false' }));

if (browser) {
	user.subscribe((u) => (localStorage.user = JSON.stringify(u)));
}
