<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status}</title>
</svelte:head>

<div class="flex justify-center">
	{#if $page.status === 404}
		<h1 class="text-5xl text-white font-bold self-center">Not found!</h1>
	{:else}
		<h1 class="text-5xl text-white font-bold self-center">Something went wrong.</h1>
	{/if}
</div>
