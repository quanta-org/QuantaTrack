<script lang="ts">
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { Input, Label, Button, Spinner } from 'flowbite-svelte';
	import { toast, isScanning } from '$lib/store';
	import type { PageData, ActionData } from './$types';

	export let form: HTMLFormElement;
	export let data: PageData;
	var charArray: string[] = [];
	let uniqname: string;
	let workstation: string;
	let trackingNumber: string;
	let TCDI: string;
	let kitID: string;
	let isWorkstation: boolean;
	let isLoading: boolean = false;

	function onKeydown(event: KeyboardEvent) {
		if (event.key.length == 1) {
			charArray.push(event.key);
		} else if (event.key == 'Tab' && charArray.length >= 10) {
			event.preventDefault();
			addScan(charArray.join(''));
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

		if (trackingNumber == '') {
			trackingNumber = input;
		} else if (TCDI == '') {
			TCDI = input;
		} else if (kitID == '') {
			kitID = input;
		}
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

<h1 class="text-4xl font-bold text-white mb-5 flex justify-center">Parcel Opening</h1>
{#if trackingNumber == ''}
	<h2 class="text-2xl text-white mb-5 flex justify-center">Scan parcel</h2>
{:else if TCDI == ''}
	<h2 class="text-2xl text-white mb-5 flex justify-center">Scan tray</h2>
{:else if kitID == ''}
	<h2 class="text-2xl text-white mb-5 flex justify-center">Scan kit</h2>
{:else}
	<h2 class="text-2xl text-white mb-5 flex justify-center">Ready to submit!</h2>
{/if}

<div class="flex justify-center">
	<form
		id="form"
		method="POST"
		class="w-96 p-5 bg-gray-800 rounded-xl"
		action="?/addParcelOpening"
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

		<div class="mb-6">
			<Label for="TCDI" class="mb-2">
				<div class="text-white">TCDI</div>
			</Label>
			<Input
				type="text"
				id="TCDI"
				name="TCDI"
				tabindex="-1"
				bind:value={TCDI}
				placeholder="TR..."
				required
			/>
		</div>

		<div class="mb-6">
			<Label for="kitID" class="mb-2">
				<div class="text-white">Kit ID</div>
			</Label>
			<Input
				type="text"
				id="kitID"
				name="kitID"
				tabindex="-1"
				bind:value={kitID}
				placeholder="K202..."
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
