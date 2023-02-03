<script lang="ts">
	import { enhance } from '$app/forms';
	import { Input, Label, Button, Spinner } from 'flowbite-svelte';
	import { toast } from '$lib/store';
	import ScanCapture from '$lib/ScanCapture.svelte';
	import type { PageData } from './$types';

	export let form: HTMLFormElement;
	export let data: PageData;
	let workstation: string;
	let trackingNumber: string = '';
	let TCDI: string = '';
	let kitID: string = '';
	let isLoading: boolean = false;
	let scanText: string | null = null;

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
				value={data.user.username}
				required
				readonly
			/>
		</div>

		<div class="mb-6">
			<Label for="workstation" class="mb-2">
				<div class="text-white">Workstation</div>
			</Label>
			<Input
				id="workstation"
				name="workstation"
				tabindex="-1"
				bind:value={workstation}
				class="mt-2"
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
