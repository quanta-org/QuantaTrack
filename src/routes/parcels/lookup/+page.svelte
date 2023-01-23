<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import {
		Pagination,
		Search,
		Button,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { toast } from '$lib/store';

	export let data: PageData;
	let parcels: App.Parcel[];
	$: parcels = JSON.parse(data.parcels);
	let filter: string = data.filter ?? '';
	$: activePageNumber = $page.url.searchParams.get('page') ?? '1';
	let pages: { name: number; href: string; active: boolean }[] = [];

	$: {
		// Set pages to the correct # of pages
		if (browser && data.pageCount) {
			pages = [];
			let url = new URL($page.url);
			for (let i = 1; i < data.pageCount + 1; i++) {
				url.searchParams.set('page', i.toString());

				// Determines which page is active
				if (i.toString() === activePageNumber) {
					pages.push({ name: i, href: url.href, active: true });
				} else {
					pages.push({ name: i, href: url.href, active: false });
				}
			}
			pages = pages;
		}
	}

	const previous = async () => {
		let url = new URL($page.url);
		let pageNumber = parseInt(activePageNumber);
		if (pageNumber > 1) {
			pageNumber -= 1;
			url.searchParams.set('page', pageNumber.toString());
			goto(url);
		}
	};

	const next = () => {
		let url = new URL($page.url);
		let pageNumber = parseInt(activePageNumber);
		if (data.pageCount && pageNumber < data.pageCount) {
			pageNumber += 1;
			url.searchParams.set('page', pageNumber.toString());
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
				url.searchParams.set('page', i.toString());
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
		<Search name="q" bind:value={filter}>
			<Button type="submit">Search</Button>
		</Search>
	</form>
</div>

<div class="flex gap-2 flex-wrap justify-center p-10">
	<Table>
		<TableHead>
			<TableHeadCell>Tracking Number</TableHeadCell>
			<TableHeadCell>Receiver</TableHeadCell>
			<TableHeadCell>Workstation</TableHeadCell>
			<TableHeadCell>Carrier</TableHeadCell>
			<TableHeadCell>Routing Code</TableHeadCell>
			<TableHeadCell>Date</TableHeadCell>
			<TableHeadCell>TCDI</TableHeadCell>
			<TableHeadCell>Kit #</TableHeadCell>
			<TableHeadCell>Kit Type</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each parcels as parcel}
				<TableBodyRow color={parcel.TCDI ? parcel.kitType ? "red" : "green" : "blue"}>
					<TableBodyCell>
						{parcel.trackingNumber}
					</TableBodyCell>
					<TableBodyCell>
						{parcel.uniqname}
					</TableBodyCell>
					<TableBodyCell>
						{parcel.workstation}
					</TableBodyCell>
					<TableBodyCell>
						{parcel.carrier}
					</TableBodyCell>
					<TableBodyCell>
						{parcel.routingLocation}
					</TableBodyCell>
					<TableBodyCell>
						{parcel.date}
					</TableBodyCell>
					<TableBodyCell>
						{parcel.TCDI}
					</TableBodyCell>
					<TableBodyCell>
						{parcel.kitID}
					</TableBodyCell>
					<TableBodyCell>
						{parcel.kitType}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>

<div class="flex justify-center p-5 pb-10">
	{#if pages}
		<Pagination {pages} on:previous={previous} on:next={next} />
	{/if}
</div>
