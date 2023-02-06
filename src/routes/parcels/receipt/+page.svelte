<script lang="ts">
	import { enhance } from '$app/forms';
	import { Input, Label, Select, Button, Spinner, CloseButton } from 'flowbite-svelte';
	import type { PageData } from './$types';
	import ScanCapture from '$lib/ScanCapture.svelte';
	import Toaster from '$lib/Toaster.svelte';
	import { browser } from '$app/environment';

	export let data: PageData;
	export let form: HTMLFormElement;
	let carrier: string;
	let trackingNumbers: string[] = [''];
	let couriers = [
		{ value: 'UPS', name: 'UPS' },
		{ value: 'FedEx', name: 'FedEx' },
		{ value: 'DHL', name: 'DHL' },
		{ value: 'USPS', name: 'USPS' },
		{ value: 'Other', name: 'Other' }
	];
	let isLoading: boolean = false;
	let scanText: string | null = null;
	let locations = data.locations;
	let toastSuccess: boolean;
	let toastMessage: string;

	$: if (scanText) {
		let ups_regex = ['^(1Z)[0-9A-Z]{16}$', '^(T)+[0-9A-Z]{10}$', '^[0-9]{9}$', '^[0-9]{26}$'];
		let fedex_regex = ['^[0-9]{20}$', '^[0-9]{15}$', '^[0-9]{12}$', '^[0-9]{22}$'];
		let usps_regex = [
			'^(94|93|92|94|95)[0-9]{20}$',
			'^(94|93|92|94|95)[0-9]{22}$',
			'^(70|14|23|03)[0-9]{14}$',
			'^(M0|82)[0-9]{8}$',
			'^([A-Z]{2})[0-9]{9}([A-Z]{2})$'
		];

		//Detect UPS
		ups_regex.forEach((value) => {
			if (scanText?.match(value)) {
				carrier = 'UPS';
			}
		});

		//Detect FedEx
		fedex_regex.forEach((value) => {
			if (scanText?.match(value)) {
				carrier = 'FedEx';
			}
		});

		//Detect USPS
		usps_regex.forEach((value) => {
			if (scanText?.match(value)) {
				carrier = 'USPS';
			}
		});

		trackingNumbers.some((trackingNumber) => {
			if (!trackingNumber) {
				trackingNumber = scanText as string;
				return true;
			}
		});
		trackingNumbers = trackingNumbers;
		console.log(trackingNumbers);

		scanText = null;
	}

	// Add empty tracking number if last index not empty
	$: if (trackingNumbers[trackingNumbers.length - 1]) {
		trackingNumbers.push('');
		trackingNumbers = trackingNumbers;
		if (browser) {
			window.scrollTo(0, document.body.scrollHeight);
		}
	}

	// Remove empty tracking numbers
	$: trackingNumbers = trackingNumbers.filter((trackingNum, index) => {
		if (trackingNum == '' && index < trackingNumbers.length - 1) {
			return false;
		}
		return true;
	});
</script>

<Toaster bind:toastMessage bind:toastSuccess />
<ScanCapture bind:text={scanText} />

<h1 class="text-4xl font-bold text-white mb-5 flex justify-center">Parcel Receipt</h1>
<h2 class="text-2xl text-white mb-5 flex justify-center">Scan parcel</h2>

<div class="flex justify-center pb-10">
	<form
		id="form"
		method="POST"
		class="w-96 p-5 bg-gray-800 rounded-xl"
		action="?/addParcelReceipt"
		bind:this={form}
		use:enhance={({}) => {
			isLoading = true;
			return async ({ result, update }) => {
				if (result.type == 'success') {
					toastSuccess = true;
					toastMessage = 'Sucessfully added parcel!';
					trackingNumbers = [];
				} else if (result.type == 'failure') {
					toastSuccess = false;
					toastMessage = result.data?.message;
				}

				isLoading = false;
				update({ reset: false });
			};
		}}
	>
		<div class="mb-6">
			<Label for="uniqname" class="mb-2">
				<div class="text-white">Uniqname</div>
			</Label>
			<Input
				type="text"
				id="uniqname"
				name="uniqname"
				value={data.user.username}
				required
				readonly
			/>
		</div>

		<div class="mb-6">
			<Label for="location" class="mb-2">
				<div class="text-white">Current Location</div>
			</Label>
			<Select id="location" name="location" items={locations} value="" class="mb-2" required />
		</div>

		<div class="mb-6">
			<Label for="carrier" class="mb-2">
				<div class="text-white">Carrier</div>
			</Label>
			<Select
				id="carrier"
				name="carrier"
				items={couriers}
				bind:value={carrier}
				class="mb-2"
				required
			/>
		</div>

		<div class="mb-6">
			<Label for="routeLocation" class="mb-2">
				<div class="text-white">Routing Location</div>
			</Label>
			<Select
				id="routeLocation"
				name="routeLocation"
				items={locations}
				value=""
				class="mb-2"
				required
			/>
		</div>

		<div class="mb-6">
			<Label for="trackingNumber" class="mb-2">
				<div class="text-white">Tracking Number</div>
			</Label>
			{#each trackingNumbers as num}
				<Input
					type="text"
					id="trackingNumber"
					name="trackingNumber"
					bind:value={num}
					placeholder="1Z 6F8..."
					class="mt-1"
					required
				>
					<CloseButton
						slot="right"
						on:click={() => {
							num = '';
						}}
					/>
				</Input>
			{/each}
		</div>

		<div class="flex justify-center">
			{#if isLoading}
				<Button>
					<Spinner class="mr-3" size="4" color="white" /> Submitting ...
				</Button>
			{:else}
				<Button type="submit">Add</Button>
			{/if}
		</div>
	</form>
</div>

<style>
</style>
