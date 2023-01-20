<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { Card, Input, Pagination, Search, Button } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { toast } from '$lib/store';
	import { enhance } from '$app/forms';

	export let data: PageData;
	let filter: string = data.filter ?? "";
	$: activePageNumber = $page.url.searchParams.get('page') ?? '1';
	let pages: { name: number, href:string, active: boolean; }[] = [];

	$: {
		// Set pages to the correct # of pages
		if (browser && data.pageCount) {
			pages = [];
			let url = new URL($page.url);
			for (let i = 1; i < data.pageCount + 1; i++) {
				url.searchParams.set("page", i.toString());

				// Determines which page is active
				if(i.toString() === activePageNumber){
					pages.push({ name: i, href: url.href, active: true });
				} else {
					pages.push({ name: i, href: url.href, active: false });
				}
			}
			pages = pages;
		}
	}

	const previous = async () => {
		let url = new URL($page.url)
		let pageNumber = parseInt(activePageNumber);
		if (pageNumber > 1) {
			pageNumber -= 1;
			url.searchParams.set("page", pageNumber.toString())
			goto(url);
		}
	};

	const next = () => {
		let url = new URL($page.url)
		let pageNumber = parseInt(activePageNumber);
		if (data.pageCount && pageNumber < data.pageCount) {
			pageNumber += 1;
			url.searchParams.set("page", pageNumber.toString())
			goto(url);
		}
	};

	onMount(() => {
		if (data.error) {
			toast.set(JSON.stringify({ message: data.error, success: 'false', show: 'true' }));
		}
		
		if (data.pageCount && data.pageCount > 1) {
			let url = new URL($page.url);
			for (var i = 1; i < data.pageCount + 1; i++) {
				url.searchParams.set("page", i.toString());
				pages.push({ name: i, href: url.href, active: false });
			}
			pages = pages;
		}
	});
</script>

<h1 class="text-4xl font-bold text-white mb-5 flex justify-center">Parcel Lookup</h1>

<div class="flex justify-center">
	<form class="flex gap-2 w-96" action="?/" method="get">
		<input type="hidden" name="page" value={activePageNumber} />
		<Search name="q" bind:value={filter} >
			<Button type="submit">Search</Button>
		</Search>
	</form>
</div>

<div class="flex gap-2 flex-wrap justify-center p-10">
	{#each JSON.parse(data.parcels) as parcel}
		<Card class="w-96">
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white break-all">
				{parcel.TRACKING_INBOUND}
			</h5>
			<p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">
				Receiver: <b>{parcel.ACTION_TECH_EMAIL}</b>
			</p>
			<p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">
				Workstation: <b>{parcel.WORKSTATION_CODE}</b>
			</p>
			<p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">
				Carrier: <b>{parcel.CARRIER}</b>
			</p>
			<p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">
				Routing Code: <b>{parcel.PARCEL_ROUTING_CODE}</b>
			</p>
			<p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">
				Date: <b>{parcel.ACTION_DATE}</b>
			</p>
			{#if parcel.TCDI}
				<p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">
					TCDI: <b>{parcel.TCDI}</b>
				</p>
				<p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">
					Kit #: <b>{parcel.KIT_ID_NUMBER}</b>
				</p>
				{#if parcel.ACTION_OWNER_BARCODE}
					<p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">
						Owner #: <b>{parcel.ACTION_OWNER_BARCODE}</b>
					</p>
				{/if}
				{#if parcel.ORDER_NUMBER}
					<p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">
						Order #: <b>{parcel.ORDER_NUMBER}</b>
					</p>
				{/if}
				{#if parcel.CLINIC_CODE}
					<p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">
						Clinic #: <b>{parcel.CLINIC_CODE}</b>
					</p>
				{/if}
			{/if}
		</Card>
	{/each}
</div>

<div class="flex justify-center p-5 pb-10">
	{#if pages}
		<Pagination {pages} on:previous={previous} on:next={next} />
	{/if}
</div>
