<script lang="ts">
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { Input, Label, Button, Spinner } from 'flowbite-svelte';
	import { toast } from '$lib/store';
	import type { PageData, ActionData } from './$types';

	export let form: HTMLFormElement;
	export let data: PageData;
	var charArray: string[] = [];
	let uniqname: string;
	let workstation: string;
	let trackingNumberOutbound: string;
	let client: string;
	let kitType: string;
	let trackingNumber: string[] = [""];
	let kitID: string[] = [""];
	let isWorkstation: boolean;
	let isLoading: boolean = false;

	function onKeypress(event: KeyboardEvent) {
		if (event.key.length == 1) {
			charArray.push(event.key);
		} else if (event.key == 'Tab' && charArray.length >= 10) {
			event.preventDefault();
			let input = charArray.join('');
			charArray = [];

			if(!trackingNumberOutbound){
				trackingNumberOutbound = input;
				return;
			}

			for(let i = 0; i < trackingNumber.length; i++){
				if(trackingNumber[i] == ""){
					trackingNumber[i] = input;
					addParcel(i);
					break;
				} else if(kitID[i] == ""){
					kitID[i] = input;
					break;
				} else if(i + 1 == trackingNumber.length){
					addParcel(i);
				}
			}
		}
	}

	function clearArray() {
		charArray = [];
	}

	function addParcel(index: number){
		if (trackingNumber.length <= index + 1){
			trackingNumber.push("");
			kitID.push("");
			trackingNumber = trackingNumber;
			kitID = kitID;
		}
	}

	function deleteParcel(index: number){
		if(trackingNumber[index - 1] != ""){
			trackingNumber[index] = "";
			kitID[index] = "";
		} else if(index != 0){
			trackingNumber.splice(index, 1);
			kitID.splice(index, 1);
			trackingNumber = trackingNumber;
			kitID = kitID;
		} else {
			trackingNumber[0] = "";
			kitID[0] = "";
		}
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

<svelte:window on:keydown={onKeypress} on:mousemove={clearArray} />

<h1 class="text-4xl font-bold text-white mb-5 flex justify-center">Parcel Assembly</h1>
{#if !trackingNumberOutbound}
	<h2 class="text-2xl text-white mb-5 flex justify-center">Scan outbound tracking number</h2>
{:else if trackingNumber[trackingNumber.length - 1] == ""}
	<h2 class="text-2xl text-white mb-5 flex justify-center">Scan tracking number</h2>
{:else if kitID[kitID.length - 1] == ""}
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
		bind:this={form}
		use:enhance={({}) => {
			isLoading = true;
			return async ({ result, update }) => {
				if (result.type == 'success') {
					toast.set(
						JSON.stringify({ message: 'Sucessfully added parcel!', success: 'true', show: 'true' })
					);
					trackingNumber = [""];
					kitID = [""];
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
			<Label for="client" class="mb-2">
				<div class="text-white">Client</div>
			</Label>
			<Input
				type="text"
				id="client"
				name="client"
				tabindex="-1"
				bind:value={client}
				required
			/>
		</div>

		<div class="mb-6">
			<Label for="kitType" class="mb-2">
				<div class="text-white">Kit Type</div>
			</Label>
			<Input
				type="text"
				id="kitType"
				name="kitType"
				tabindex="-1"
				bind:value={kitType}
				required
			/>
		</div>

		<div class="mb-6">
			<Label for="trackingNumberOutbound" class="mb-2">
				<div class="text-white">Outbound Tracking Number</div>
			</Label>
			<Input
				type="text"
				id="trackingNumberOutbound"
				name="trackingNumberOutbound"
				tabindex="-1"
				bind:value={trackingNumberOutbound}
				required
			/>
		</div>

		{#each trackingNumber as track, index}
			<div class="mb-6">
				<div class="flex justify-between">
					<Label for="trackingNumber{index}" class="mb-2">
						<div class="text-white">Kit {index + 1}</div>
					</Label>
					<button type="button" class="text-white order-last cursor-pointer" on:click={() => {deleteParcel(index)}}>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<Input
					type="text"
					id="trackingNumber{index}"
					name="trackingNumber"
					tabindex="-1"
					bind:value={trackingNumber[index]}
					placeholder="Tracking number"
					on:input={() => {addParcel(index)}}
				/>
				<Input
					type="text"
					id="kitID{index}"
					name="kitID"
					tabindex="-1"
					bind:value={kitID[index]}
					placeholder="Kit ID"
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
				<Button type="submit" tabindex="-1">Add</Button>
			{/if}
		</div>
	</form>
</div>