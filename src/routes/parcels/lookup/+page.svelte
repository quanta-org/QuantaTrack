<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { Card, Input, Pagination } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { toast } from '$lib/store';

	export let data: PageData;
	let filter: string = '';
	$: activeUrl = $page.url.searchParams.get('page') ?? '1';
	$: filteredList = filterList(JSON.parse(data.parcels), filter);
	let pages = [{ name: 1, href: '/parcels/lookup?page=1', active: true }];

	$: {
		pages.forEach((page) => {
			let splitUrl = page.href.split('?');
			let queryString = splitUrl.slice(1).join('?');
			const hrefParams = new URLSearchParams(queryString);
			let hrefValue = hrefParams.get('page');
			if (hrefValue === activeUrl) {
				page.active = true;
			} else {
				page.active = false;
			}
		});

		if (!activeUrl) {
			pages[0].active = true;
		}

		pages = pages;
	}

	const previous = async () => {
		let pageNumber = parseInt(activeUrl as string);
		if (pageNumber > 1) {
			pageNumber -= 1;
			goto('/parcels/lookup?page=' + pageNumber);
		}
	};

	const next = () => {
		let pageNumber = parseInt(activeUrl as string);
		if (data.pageCount && pageNumber < data.pageCount) {
			pageNumber += 1;
			goto('/parcels/lookup?page=' + pageNumber);
		}
	};

	function filterList(list: any[], filter: string) {
		let out: any[] = [];
		filter = filter.toLowerCase();

		list.forEach((item) => {
			if (item.TRACKING_INBOUND.toLowerCase().indexOf(filter) !== -1) {
				out.push(item);
			} else if (item.ACTION_TECH_EMAIL.toLowerCase().indexOf(filter) !== -1) {
				out.push(item);
			} else if (item.KIT_ID_NUMBER && item.KIT_ID_NUMBER.indexOf(filter) !== -1) {
				console.log(item.KIT_ID_NUMBER);
				out.push(item);
			} else if (item.TCDI && item.TCDI.indexOf(filter) !== -1) {
				console.log(item.TCDI);
				out.push(item);
			}
		});

		return out;
	}

	onMount(() => {
		if (data.error) {
			toast.set(JSON.stringify({ message: data.error, success: 'false', show: 'true' }));
		}

		if (data.pageCount && data.pageCount > 1) {
			console.log(data.pageCount);
			for (var i = 2; i < data.pageCount + 1; i++) {
				pages.push({ name: i, href: '/parcels/lookup?page=' + i, active: false });
				console.log(pages);
			}
			pages = pages;
		}
	});
</script>

<h1 class="text-4xl font-bold text-white mb-5 flex justify-center">Parcel Lookup</h1>

<div class="flex justify-center">
	<Input
		type="text"
		class="w-96 mx-2"
		bind:value={filter}
		placeholder="Search by tracking number, kit, tcdi, receiver..."
	/>
</div>

<div class="flex gap-2 flex-wrap justify-center p-10">
	{#each filteredList as parcel}
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
	<Pagination {pages} on:previous={previous} on:next={next} />
</div>
