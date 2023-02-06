<script lang="ts">
	import '../app.css';
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
		Button
	} from 'flowbite-svelte';
	import { isScanning } from '$lib/store';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;
	let scanning: boolean = false;

	async function logout() {
		await fetch(`/login?/logout`, { method: 'POST', body: new FormData() });
		data.user = null;
		goto('/');
	}

	isScanning.subscribe((scanner) => {
		if (scanner === 'true') {
			scanning = true;
		} else {
			scanning = false;
		}
	});
</script>

{#if scanning}
	<div
		class="fixed h-screen w-screen border-0 shadow-green-500 shadow-[inset_0px_0px_70px_rgba(0,255,9,1)] pointer-events-none"
	/>
{/if}

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
			on:click={() => {
				!hidden && toggle();
			}}
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
			on:click={() => {
				!hidden && toggle();
			}}
			activeClass="text-white bg-blue-600 md:bg-transparent"
			nonActiveClass="md:border-0 text-gray-400 md:hover:text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent"
			>Blocks & Slides</NavLi
		>
		<NavLi
			href="#"
			on:click={() => {
				!hidden && toggle();
			}}
			activeClass="text-white bg-blue-600 md:bg-transparent"
			nonActiveClass="pl-0 md:border-0 text-gray-400 md:hover:text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent"
			>Kits</NavLi
		>

		<Dropdown triggeredBy="#nav-menu1" class="w-44 z-20">
			<DropdownItem
				on:click={() => {
					!hidden && toggle();
				}}
				href="/parcels/assembly">Assembly</DropdownItem
			>
			<DropdownItem
				on:click={() => {
					!hidden && toggle();
				}}
				href="/parcels/receipt">Receipt</DropdownItem
			>
			<DropdownItem
				on:click={() => {
					!hidden && toggle();
				}}
				href="/parcels/opening">Opening</DropdownItem
			>
			<DropdownDivider />
			<DropdownItem
				on:click={() => {
					!hidden && toggle();
				}}
				href="/parcels/lookup">Lookup</DropdownItem
			>
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
				<DropdownItem
					on:click={() => {
						logout();
						!hidden && toggle();
					}}>Logout</DropdownItem
				>
			</Dropdown>
		{:else}
			<Button
				on:click={() => {
					!hidden && toggle();
				}}
				href="/login">Login</Button
			>
		{/if}
	</NavUl>
</Navbar>

<div class="bg-gray-900 min-h-screen w-full bg-plus">
	<div class="mx-auto pt-10 h-full">
		<slot />
	</div>
</div>
