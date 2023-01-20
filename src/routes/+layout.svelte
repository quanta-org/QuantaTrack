<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Dropdown,
		DropdownItem,
		Chevron,
		DropdownDivider,
		Button,
		Toast
	} from 'flowbite-svelte';
	import { toast } from '$lib/store';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';

	export let data: PageData;
	let toastSuccess: boolean = false;
	let toastError: boolean = false;
	let toastMessage: string = '';

	async function logout() {
		await fetch(`/login?/logout`, { method: 'POST', body: new FormData() });
		data.user = null;
		goto('/');
	}

	toast.subscribe((toaster) => {
		if (JSON.parse(toaster).show == 'true') {
			toastMessage = JSON.parse(toaster).message;

			if (JSON.parse(toaster).success == 'true') {
				toastSuccess = true;
				setTimeout(() => {
					toastSuccess = false;
				}, 5000);
			} else {
				toastError = true;
				setTimeout(() => {
					toastError = false;
				}, 5000);
			}

			toast.set(JSON.stringify({ message: '', success: 'false', show: 'false' }));
		}
	});

	onMount(() => {
		document.documentElement.classList.add('dark');
	});
</script>


<Navbar
	let:hidden
	let:toggle
	color="none"
	navClass="px-2 sm:px-4 py-2.5 w-full bg-gray-800 border-b border-gray-700"
>
	<NavBrand href="/">
		<img src="/Signature-Vertical-M.png" class="mr-3 h-6 sm:h-9" alt="UofM Logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold text-white">
			Quanta Track
		</span>
	</NavBrand>
	<NavHamburger on:click={toggle} />
	<NavUl {hidden} class="rounded-lg md:bg-gray-900 border-gray-700">
		<NavLi
			href="/"
			active={$page.url.pathname === '/'}
			activeClass="text-white bg-blue-600 md:bg-transparent"
			nonActiveClass="md:border-0 text-gray-400 md:hover:text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent"
			>Home</NavLi
		>
		<NavLi
			id="nav-menu1"
			class="cursor-pointer"
			active={$page.url.pathname.includes('/parcels')}
			activeClass="text-white bg-blue-600 md:bg-transparent"
			nonActiveClass="md:border-0 text-gray-400 md:hover:text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent"
			><Chevron aligned>Parcels</Chevron></NavLi
		>
		<NavLi
			href="#"
			activeClass="text-white bg-blue-600 md:bg-transparent"
			nonActiveClass="md:border-0 text-gray-400 md:hover:text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent"
			>Blocks & Slides</NavLi
		>
		<NavLi
			href="#"
			activeClass="text-white bg-blue-600 md:bg-transparent"
			nonActiveClass="pl-0 md:border-0 text-gray-400 md:hover:text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent"
			>Kits</NavLi
		>

		<Dropdown triggeredBy="#nav-menu1" class="w-44 z-20">
			<DropdownItem href="/parcels/receipt">Receipt</DropdownItem>
			<DropdownItem href="/parcels/opening">Opening</DropdownItem>
			<DropdownDivider />
			<DropdownItem href="/parcels/lookup">Lookup</DropdownItem>
		</Dropdown>
	</NavUl>

	<NavUl {hidden}>
		{#if data.user}
			<NavLi
				id="nav-menu2"
				class="cursor-pointer"
				activeClass="text-white bg-blue-600 md:bg-transparent"
				nonActiveClass="md:border-0 text-gray-400 md:hover:text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent"
				><Chevron aligned><b>{data.user.username}</b></Chevron></NavLi
			>
			<Dropdown triggeredBy="#nav-menu2" class="w-44 z-20">
				<DropdownItem on:click={logout}>Logout</DropdownItem>
			</Dropdown>
		{:else}
			<Button href="/login">Login</Button>
		{/if}
	</NavUl>
</Navbar>

<div class="flex justify-center">
	<Toast color="green" transition={fade} bind:open={toastSuccess} class="mb-2 absolute mt-5">
		<svelte:fragment slot="icon">
			<svg
				aria-hidden="true"
				class="w-5 h-5"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
					clip-rule="evenodd"
				/></svg
			>
			<span class="sr-only">Check icon</span>
		</svelte:fragment>
		{toastMessage}
	</Toast>

	<Toast color="red" transition={fade} bind:open={toastError} class="mb-2 absolute mt-5">
		<svelte:fragment slot="icon">
			<svg
				aria-hidden="true"
				class="w-5 h-5"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
					clip-rule="evenodd"
				/></svg
			>
			<span class="sr-only">Warning icon</span>
		</svelte:fragment>
		{toastMessage}
	</Toast>
</div>

<div class="bg-gray-900 min-h-screen w-full bg-plus">
	<div class="mx-auto pt-10 h-full">
		<slot />
	</div>
</div>
