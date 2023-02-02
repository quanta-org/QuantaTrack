<script lang="ts">
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { Input, Label, Select, Button, Spinner } from 'flowbite-svelte';
	import { toast, isScanning } from '$lib/store';
	import type { PageData } from './$types';

	export let data: PageData;
	export let form: HTMLFormElement;
	var charArray: string[] = [];
	let uniqname: string;
	let workstation: string;
	let carrier: string;
	let trackingNumber: string;
	let isWorkstation: boolean;
	let routingLocations = [
		{ value: 'NCRC-CONSULT', name: 'NCRC-CONSULT' },
		{ value: 'Location 2', name: 'Location 2' },
		{ value: 'Location 3', name: 'Location 3' },
		{ value: 'Location 4', name: 'Location 4' }
	];
	let couriers = [
		{ value: 'UPS', name: 'UPS' },
		{ value: 'FedEx', name: 'FedEx' },
		{ value: 'DHL', name: 'DHL' },
		{ value: 'USPS', name: 'USPS' },
		{ value: 'Other', name: 'Other' }
	];
	let isLoading: boolean = false;

	function onKeydown(event: KeyboardEvent) {
		if (event.key.length == 1) {
			charArray.push(event.key);
		} else if (event.key == 'Tab' && charArray.length >= 10) {
			event.preventDefault();
			addScan(charArray.join(''))
		} else if (event.key == 'Unidentified') {
			isScanning.set('true');
		}
	}

	function onKeyup(event: KeyboardEvent) {
		if (event.key == 'Unidentified' && $isScanning == 'true') {
			isScanning.set('false');
			addScan(charArray.join(''));
		}
	}

	function addScan(input: string) {
		charArray = [];

		if (trackingNumber === input) {
			form.requestSubmit();
			return;
		}

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
			if (input.match(value)) {
				carrier = 'UPS';
			}
		});

		//Detect FedEx
		fedex_regex.forEach((value) => {
			if (input.match(value)) {
				carrier = 'FedEx';
			}
		});

		//Detect USPS
		usps_regex.forEach((value) => {
			if (input.match(value)) {
				carrier = 'USPS';
			}
		});

		trackingNumber = input;
	}

	function clearArray() {
		charArray = [];
	}

	onMount(() => {
		if (data.user) {
			if (data.user.auth === false) {
				workstation = data.user.username;
				isWorkstation = true;
			} else {
				uniqname = data.user.username;
				isWorkstation = false;
			}
		}
	});
</script>

<svelte:window on:keydown={onKeydown} on:keyup={onKeyup} on:mousemove={clearArray} on:scroll={clearArray} />

<h1 class="text-4xl font-bold text-white mb-5 flex justify-center">Parcel Receipt</h1>
{#if trackingNumber}
	<h2 class="text-2xl text-white mb-5 flex justify-center">Scan again to add</h2>
{:else}
	<h2 class="text-2xl text-white mb-5 flex justify-center">Scan parcel or add tracking number</h2>
{/if}

<div class="flex justify-center">
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
					toast.set(
						JSON.stringify({ message: 'Sucessfully added parcel!', success: 'true', show: 'true' })
					);
					trackingNumber = '';
				} else if (result.type == 'failure') {
					toast.set(
						JSON.stringify({ message: result.data?.message, success: 'false', show: 'true' })
					);
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
				tabindex="-1"
				bind:value={uniqname}
				on:change={clearArray}
				required
			/>
		</div>

		<div class="mb-6">
			<Label for="workstation" class="mb-2">
				<div class="text-white">Workstation</div>
			</Label>
			{#if isWorkstation}
				<Input
					id="workstation"
					name="workstation"
					tabindex="-1"
					bind:value={workstation}
					class="mt-2"
					readonly
					required
				/>
			{:else}
				<Input
					id="workstation"
					name="workstation"
					tabindex="-1"
					bind:value={workstation}
					class="mt-2"
					required
				/>
			{/if}
		</div>

		<div class="mb-6">
			<Label for="carrier" class="mb-2">
				<div class="text-white">Carrier</div>
			</Label>
			<Select
				id="carrier"
				name="carrier"
				tabindex="-1"
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
				tabindex="-1"
				items={routingLocations}
				value=""
				class="mb-2"
				required
			/>
		</div>

		<div class="mb-6">
			<Label for="trackingNumber" class="mb-2">
				<div class="text-white">Tracking Number</div>
			</Label>
			<Input
				type="text"
				id="trackingNumber"
				name="trackingNumber"
				tabindex="-1"
				bind:value={trackingNumber}
				placeholder="1Z 6F8..."
				required
			/>
		</div>

		<div class="flex justify-center">
			{#if isLoading}
				<Button>
					<Spinner class="mr-3" size="4" color="white" /> Submitting ...
				</Button>
			{:else}
				<Button type="submit" tabindex="-1">Add</Button>
			{/if}
		</div>
	</form>
</div>

<style>
</style>
