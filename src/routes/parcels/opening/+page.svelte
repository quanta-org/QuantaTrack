<script lang="ts">
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { Input, Label, Button } from 'flowbite-svelte';
	import { toast } from '$lib/store';
	import type { PageData } from './$types';

	export let form: HTMLFormElement;
	export let data: PageData;
	var charArray: string[] = [];
	let ParcelOpening = {
		ReceiverID: 'John',
		workstationCode: '',
		TrackingNumber: '',
		TCDI: '',
		kitID: ''
	};
	let isWorkstation: boolean;

	function onKeypress(event: KeyboardEvent) {
		if (event.key.length == 1) {
			charArray.push(event.key);
		} else if (event.key == 'Tab' && charArray.length >= 10) {
			event.preventDefault();
			let tracknum = charArray.join('');
			charArray = [];

			if (ParcelOpening.TrackingNumber === tracknum) {
				form.requestSubmit();
				return;
			}

			ParcelOpening.TrackingNumber = tracknum;
		}
	}

	function clearArray() {
		charArray = [];
	}

	onMount(() => {
		if (data.user) {
			if (data.user.auth === false) {
				ParcelOpening.workstationCode = data.user.username;
				isWorkstation = true;
			} else {
				ParcelOpening.ReceiverID = data.user.username;
				isWorkstation = false;
			}
		}
	});
</script>

<svelte:window on:keydown={onKeypress} on:mousemove={clearArray} />

<h1 class="text-4xl font-bold text-white mb-5 flex justify-center">Parcel Opening</h1>
{#if ParcelOpening.TrackingNumber}
	<h2 class="text-2xl text-white mb-5 flex justify-center">Scan again to add</h2>
{:else}
	<h2 class="text-2xl text-white mb-5 flex justify-center">Scan parcel or add tracking number</h2>
{/if}

<div class="flex justify-center">
	<form
		id="form"
		method="POST"
		class="w-96 p-5 bg-gray-800 rounded-xl"
		action="?/addParcelOpening"
		bind:this={form}
		use:enhance={({}) => {
			return async ({ result, update }) => {
				if (result.type == 'success') {
					toast.set(
						JSON.stringify({ message: 'Sucessfully added parcel!', success: 'true', show: 'true' })
					);
					ParcelOpening.TrackingNumber = '';
				} else if (result.type == 'failure') {
					toast.set(
						JSON.stringify({ message: result.data?.message, success: 'false', show: 'true' })
					);
				}

				update({ reset: false });
			};
		}}
	>
		<div class="mb-6">
			<Label for="user" class="mb-2">
				<div class="text-white">User</div>
			</Label>
			<Input
				type="text"
				id="user"
				name="user"
				tabindex="-1"
				bind:value={ParcelOpening.ReceiverID}
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
					name="workstationCode"
					tabindex="-1"
					bind:value={ParcelOpening.workstationCode}
					class="mt-2"
					readonly
					required
				/>
			{:else}
				<Input
					id="workstation"
					name="workstationCode"
					tabindex="-1"
					bind:value={ParcelOpening.workstationCode}
					class="mt-2"
					required
				/>
			{/if}
		</div>

		<div class="mb-6">
			<Label for="tracknum" class="mb-2">
				<div class="text-white">Tracking Number</div>
			</Label>
			<Input
				type="text"
				id="tracknum"
				name="trackNumber"
				tabindex="-1"
				bind:value={ParcelOpening.TrackingNumber}
				placeholder="1Z 6F8..."
				required
			/>
		</div>

		<div class="mb-6">
			<Label for="tcdi" class="mb-2">
				<div class="text-white">TCDI</div>
			</Label>
			<Input
				type="text"
				id="tcdi"
				name="tcdi"
				tabindex="-1"
				bind:value={ParcelOpening.TCDI}
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
				bind:value={ParcelOpening.kitID}
				placeholder="K202..."
				required
			/>
		</div>

		<div class="flex justify-center">
			<Button type="submit" tabindex="-1">Add Receipt</Button>
		</div>
	</form>
</div>

<style>
</style>
