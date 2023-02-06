<script lang="ts">
	import { page } from '$app/stores';
	import {
		Pagination,
		Search,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Spinner,
		ListPlaceholder
	} from 'flowbite-svelte';
	import { browser } from '$app/environment';
	import { toast } from '$lib/store';
	import { goto } from '$app/navigation';
	import type { Parcel } from '$lib/types';

	let pageCount: number = 0;
	let filter: string = $page.url.searchParams.get('q') ?? '';
	let activePageNumber: string = '1';
	$: activePageNumber = $page.url.searchParams.get('page') ?? '1';
	$: parcels = getParcels(filter, activePageNumber);
	let pages: { name: number; href: string; active: boolean }[] = [];

	// Set pages to the correct # of pages
	$: if (browser && pageCount) {
		pages = [];
		let url = new URL($page.url);
		for (let i = 1; i < pageCount + 1; i++) {
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
		if (pageCount && pageNumber < pageCount) {
			pageNumber += 1;
			url.searchParams.set('page', pageNumber.toString());
			goto(url);
		}
	};

	async function getParcels(filter: string, page: string): Promise<Parcel[]> {
		let turl = new URL($page.url);
		turl.searchParams.set('q', filter);
		turl.searchParams.set('page', page);
		const parcelData = await (await fetch(turl)).json();

		if (parcelData.error) {
			toast.set(JSON.stringify({ message: parcelData.error, success: 'false', show: 'true' }));
		}

		/* This was in onMount, not sure why, shouldn't be necessary
		if(parcelData.pageCount && parcelData.pageCount > 1){
			let url = new URL($page.url);
			for (var i = 1; i < pageCount + 1; i++) {
				url.searchParams.set('page', i.toString());
				pages.push({ name: i, href: url.href, active: false });
			}
			pages = pages;
		}*/

		pageCount = parcelData.pageCount;

		return parcelData.parcels;
	}
</script>

<h1 class="text-4xl font-bold text-white mb-5 flex justify-center">Parcel Lookup</h1>

<div class="flex justify-center">
	<form class="flex gap-2 w-96" method="get">
		<Search name="q" bind:value={filter}>
			{#await parcels}
				<Spinner class="mr-3" size="4" color="white" />
			{/await}
		</Search>
	</form>
</div>

<div class="flex flex-col xl:mx-60 lg:mx-40 flex-wrap justify-center pt-10 overflow-x-auto">
	<Table>
		<TableHead>
			<TableHeadCell>Status</TableHeadCell>
			<TableHeadCell>Tracking #</TableHeadCell>
			<TableHeadCell>Uniqname</TableHeadCell>
			<TableHeadCell>Location</TableHeadCell>
			<TableHeadCell>Carrier</TableHeadCell>
			<TableHeadCell>Date</TableHeadCell>
			<TableHeadCell>Tray #</TableHeadCell>
			<TableHeadCell>Kit #</TableHeadCell>
		</TableHead>
		<!-- svelte-ignore empty-block -->
		{#await parcels then parcels}
			<TableBody tableBodyClass="divide-y">
				{#each parcels as parcel}
					<TableBodyRow>
						<TableBodyCell>
							{parcel.status}
						</TableBodyCell>
						<TableBodyCell>
							{parcel.trackingNumber}
						</TableBodyCell>
						<TableBodyCell>
							{parcel.uniqname}
						</TableBodyCell>
						<TableBodyCell>
							{#if parcel.status == "Received"}
								{parcel.workstation} -> {parcel.routingLocation}
							{:else}
								{parcel.workstation}
							{/if}
						</TableBodyCell>
						<TableBodyCell>
							{parcel.carrier ? parcel.carrier : ""}
						</TableBodyCell>
						<TableBodyCell>
							{parcel.date ? new Date(parcel.date).toLocaleDateString() : "null"}
						</TableBodyCell>
						<TableBodyCell>
							{parcel.TCDI ? parcel.TCDI : ""}
						</TableBodyCell>
						<TableBodyCell>
							{parcel.kitID}
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		{/await}
	</Table>
	{#await parcels}
		<div class="bg-gray-800">
			<ListPlaceholder
				divClass="p-4 space-y-4 rounded border divide-y shadow animate-pulse divide-gray-700 md:p-6 border-gray-700"
			/>
		</div>
	{/await}
</div>

<div class="flex justify-center p-5 pb-10">
	{#if pages}
		<Pagination {pages} on:previous={previous} on:next={next} />
	{/if}
</div>
