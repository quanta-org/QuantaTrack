<script lang="ts">
	import { enhance } from '$app/forms';
	import { Input, Label, Button, Spinner, Select, CloseButton } from 'flowbite-svelte';
	import ScanCapture from '$lib/ScanCapture.svelte';
	import Toaster from '$lib/Toaster.svelte';
	import type { PageData } from './$types';

	export let form: HTMLFormElement;
	export let data: PageData;
	let trackingNumber: string = '';
	let TCDI: string = '';
	let kitID: string = '';
	let isLoading: boolean = false;
	let scanText: string | null = null;
	let locations = data.locations;
	let toastSuccess: boolean;
	let toastMessage: string;

	$: if (scanText) {
		if (trackingNumber == '') {
			trackingNumber = scanText;
		} else if (TCDI == '') {
			TCDI = scanText;
		} else if (kitID == '') {
			kitID = scanText;
		}
		scanText = null;
	}
</script>

<Toaster bind:toastMessage bind:toastSuccess />
<ScanCapture bind:text={scanText} />

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

<div class="flex justify-center pb-10">
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
					toastSuccess = true;
					toastMessage = 'Sucessfully added parcel!';
					trackingNumber = '';
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
				<div class="text-white">Location</div>
			</Label>
			<Select id="location" name="location" items={locations} value="" class="mb-2" required />
		</div>

		<div class="mb-6">
			<Label for="trackingNumber" class="mb-2">
				<div class="text-white">Tracking #</div>
			</Label>
			<Input
				type="text"
				id="trackingNumber"
				name="trackingNumber"
				bind:value={trackingNumber}
				placeholder="1Z 6F8..."
				required
			>
				<CloseButton
					slot="right"
					on:click={() => {
						trackingNumber = '';
					}}
				/>
			</Input>
		</div>

		<div class="mb-6">
			<Label for="TCDI" class="mb-2">
				<div class="text-white">Tray #</div>
			</Label>
			<Input type="text" id="TCDI" name="TCDI" bind:value={TCDI} placeholder="TR..." required>
				<CloseButton
					slot="right"
					on:click={() => {
						TCDI = '';
					}}
				/>
			</Input>
		</div>

		<div class="mb-6">
			<Label for="kitID" class="mb-2">
				<div class="text-white">Kit #</div>
			</Label>
			<Input type="text" id="kitID" name="kitID" bind:value={kitID} placeholder="K202...">
				<CloseButton
					slot="right"
					on:click={() => {
						kitID = '';
					}}
				/>
			</Input>
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
