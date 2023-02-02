<script lang="ts">
	import { Input, Label, Button } from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/store';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import ScanCapture from '$lib/ScanCapture.svelte';

	export let data: PageData;
	let uniqname: string;
	let scanText: string | null;

	$: if (scanText) {
		login(scanText);
		scanText = null;
	}

	async function login(uniqname: string) {
		const data = new FormData();
		data.append('uniqname', uniqname);
		await fetch(`?/scanLogin`, { method: 'POST', body: data });
		await invalidateAll();

		if ($page.url.searchParams.has('redirect')) {
			await goto($page.url.searchParams.get('redirect') as string);
		} else {
			await goto('/');
		}
	}
</script>

<ScanCapture bind:text={scanText} />

<div class="flex justify-center">
	<div class="flex mb-4 bg-gray-200 p-10 rounded gap-10 justify-center">
		<div class="shrink self-center">
			<img src="U-of-M-Logo.png" alt="U of M logo" class="max-h-36" />
		</div>
		<h2 class="self-center text-4xl font-bold text-blue-900">Level-2 Login</h2>
	</div>
</div>

<div class="flex justify-center mt-10 pb-10">
	{#if !data.user}
		<form
			method="POST"
			action="?/login"
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
				<h2 class="text-white font-bold text-2xl ml-5 self-center">Scan Badge</h2>
			</div>

			<h2 class="text-white text-xl text-center">or</h2>

			<input
				name="redirect"
				class="hidden"
				type="hidden"
				value={$page.url.searchParams.get('redirect')}
			/>
			<Label class="mb-2">
				<div class="text-white">Uniqname:</div>
				<Input name="uniqname" type="text" bind:value={uniqname} required color={undefined} />
			</Label>
			<Label class="mb-2">
				<div class="text-white">Password:</div>
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
			{#if $page.url.searchParams.get('err') == 'unauthorized'}
				<h2 class="text-white text-xl self-center">
					Logged in as user: <b>{data.user.username}</b>
				</h2>
				<h3 class="text-white text-xl self-center">Log in with password to access.</h3>
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
