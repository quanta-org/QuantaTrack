<script lang="ts">
	import { enhance } from '$app/forms';
	import { Input, Label, Button, Spinner, Select, CloseButton } from 'flowbite-svelte';
	import ScanCapture from '$lib/ScanCapture.svelte';
	import Toaster from '$lib/Toaster.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let trackingNumberOutbound: string;
	let client: string;
	let kitType: string;
	let trackingNumber: string[] = [''];
	let kitID: string[] = [''];
	let isLoading: boolean = false;
	let scanText: string | null = null;
	let locations = data.locations;
	let toastMessage: string;
	let toastSuccess: boolean;

	$: if (scanText) {
		if (!trackingNumberOutbound) {
			trackingNumberOutbound = scanText;
		} else {
			for (let i = 0; i < trackingNumber.length; i++) {
				if (trackingNumber[i] == '') {
					trackingNumber[i] = scanText;
					addKit(i);
					break;
				} else if (kitID[i] == '') {
					kitID[i] = scanText;
					break;
				} else if (i + 1 == trackingNumber.length) {
					addKit(i);
				}
			}
		}

		scanText = null;
	}

	function addKit(index: number) {
		if (trackingNumber.length <= index + 1) {
			trackingNumber.push('');
			kitID.push('');
			trackingNumber = trackingNumber;
			kitID = kitID;
		}
		window.scrollTo(0, document.body.scrollHeight);
	}

	function deleteKit(index: number) {
		if (index == trackingNumber.length - 1) {
			trackingNumber[index] = '';
			kitID[index] = '';
		} else {
			trackingNumber.splice(index, 1);
			kitID.splice(index, 1);
			trackingNumber = trackingNumber;
			kitID = kitID;
		}
	}
</script>

<Toaster bind:toastMessage bind:toastSuccess />
<ScanCapture bind:text={scanText} />

<h1 class="text-4xl font-bold text-white mb-5 flex justify-center">Parcel Assembly</h1>
{#if !trackingNumberOutbound}
	<h2 class="text-2xl text-white mb-5 flex justify-center">Scan outbound tracking number</h2>
{:else if trackingNumber[trackingNumber.length - 1] == ''}
	<h2 class="text-2xl text-white mb-5 flex justify-center">Scan tracking number</h2>
{:else if kitID[kitID.length - 1] == ''}
	<h2 class="text-2xl text-white mb-5 flex justify-center">Scan kit ID</h2>
{:else}
	<h2 class="text-2xl text-white mb-5 flex justify-center">Scan tracking number</h2>
{/if}

<div class="flex justify-center pb-10">
	<form
		id="form"
		method="POST"
		class="w-96 p-5 bg-gray-800 rounded-xl"
		action="?/addKitAssembly"
		use:enhance={({}) => {
			isLoading = true;
			return async ({ result, update }) => {
				if (result.type == 'success') {
					toastSuccess = true;
					toastMessage = 'Sucessfully added parcel!';
					trackingNumber = [''];
					kitID = [''];
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
			<Label for="client" class="mb-2">
				<div class="text-white">Clinic Code</div>
			</Label>
			<Input type="text" id="client" name="client" placeholder="MIMD" bind:value={client} required>
				<CloseButton
					slot="right"
					on:click={() => {
						client = '';
					}}
				/>
			</Input>
		</div>

		<div class="mb-6">
			<Label for="kitType" class="mb-2">
				<div class="text-white">Kit Type</div>
			</Label>
			<Input
				type="text"
				id="kitType"
				name="kitType"
				placeholder="Biopsy"
				bind:value={kitType}
				required
			>
				<CloseButton
					slot="right"
					on:click={() => {
						kitType = '';
					}}
				/>
			</Input>
		</div>

		<div class="mb-6">
			<Label for="trackingNumberOutbound" class="mb-2">
				<div class="text-white">Outbound Tracking #</div>
			</Label>
			<Input
				type="text"
				id="trackingNumberOutbound"
				name="trackingNumberOutbound"
				bind:value={trackingNumberOutbound}
				placeholder="1Z 6F8..."
				required
			>
				<CloseButton
					slot="right"
					on:click={() => {
						trackingNumberOutbound = '';
					}}
				/>
			</Input>
		</div>

		{#each trackingNumber as track, index}
			<div class="mb-6">
				<div class="flex justify-between">
					<Label for="trackingNumber{index}" class="mb-2">
						<div class="text-white">Kit {index + 1}</div>
					</Label>
					<CloseButton
						class="text-white"
						on:click={() => {
							deleteKit(index);
						}}
					/>
				</div>
				<Input
					type="text"
					id="trackingNumber{index}"
					name="trackingNumber"
					bind:value={trackingNumber[index]}
					placeholder="Tracking #"
					on:input={() => {
						addKit(index);
					}}
				/>
				<Input
					type="text"
					id="kitID{index}"
					name="kitID"
					bind:value={kitID[index]}
					placeholder="Kit #"
					defaultClass="block mt-1 w-full"
				/>
			</div>
		{/each}

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
