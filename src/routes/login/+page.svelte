<script lang="ts">
	import { Input, Label, Button } from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/store';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	export let data: PageData;
	let username: string;
	let charArray: string[] = [];
	let stationid: string = '';

	async function onKeypress(event: KeyboardEvent) {
		if (event.key.length == 1) {
			charArray.push(event.key);
		} else if (event.key == 'Tab' && charArray.length >= 10) {
			event.preventDefault();
			stationid = charArray.join('');
			const data = new FormData();
			data.append('stationid', stationid);
			charArray = [];

			await fetch(`?/stationlogin`, { method: 'POST', body: data });

			await invalidateAll();

			if ($page.url.searchParams.has('redirect')) {
				await goto($page.url.searchParams.get('redirect') ?? '');
			} else {
				await goto('/');
			}
		}
	}

	function clearArray() {
		charArray = [];
	}
</script>

<svelte:window on:keydown={onKeypress} on:mousemove={clearArray} />

<div class="flex justify-center">
	<div class="flex flex-wrap mb-4 bg-gray-200 p-10 rounded gap-10 justify-center">
		<img src="U-of-M-Logo.png" alt="U of M logo" class="h-36 justify-self-center" />
		<h2 class="self-center text-4xl font-bold text-blue-900">Level-2 Login</h2>
	</div>
</div>

<div class="flex justify-center m-10 mb-20">
	{#if !data.user}
		<form
			method="POST"
			action="?/login&redirect={$page.url.searchParams.get('redirect')}"
			class="p-5 w-96 bg-gray-800 rounded-xl"
			use:enhance={({}) => {
				return async ({ result, update }) => {
					if (result.type == 'failure') {
						toast.set(
							JSON.stringify({ message: result.data?.message, success: 'false', show: 'true' })
						);
					}

					update();
				};
			}}
		>
			<div class="flex justify-center m-2">
				<img class="invert" src="/scan.svg" alt="Barcode scan" width="100" height="100" />
				<h2 class="text-white font-bold text-2xl ml-5 self-center">Scan Station Code</h2>
			</div>

			<h2 class="text-white text-xl text-center">or</h2>

			<Label class="mb-2">
				User Name:
				<Input name="username" type="text" bind:value={username} required />
			</Label>
			<Label class="mb-2">
				Password:
				<Input name="password" type="password" required />
			</Label>
			<div class="flex justify-center gap-2 mt-5">
				<Button type="submit">OK</Button>
				<Button href="/">Cancel</Button>
			</div>
		</form>
	{:else}
		<form
			method="POST"
			action="?/logout"
			class="p-10 bg-gray-800 rounded-xl"
			use:enhance={({}) => {
				return async ({ result, update }) => {
					if (result.type == 'failure') {
						toast.set(
							JSON.stringify({ message: result.data?.message, success: 'false', show: 'true' })
						);
					}

					update();
				};
			}}
		>
			{#if $page.url.searchParams.get('err') == 'tokenexpired'}
				<h2 class="text-white text-xl self-center">Access expired. Please log out.</h2>
			{:else if $page.url.searchParams.get('err') == 'unauthorized'}
				<h2 class="text-white text-xl self-center">
					Logged in as station: <b>{data.user.username}</b>
				</h2>
				<h3 class="text-white text-xl self-center">Log in as user to access.</h3>
			{:else}
				<h2 class="text-white text-xl self-center">
					Logged in as user: <b>{data.user.username}</b>
				</h2>
			{/if}
			<div class="flex justify-center mt-5">
				<Button type="submit">Logout</Button>
			</div>
		</form>
	{/if}
</div>