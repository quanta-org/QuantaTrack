<script lang="ts">
	let keydown: KeyboardEvent[] = [];
	let keypress: KeyboardEvent[] = [];
	let keyup: KeyboardEvent[] = [];

	function onKeyDown(event: KeyboardEvent) {
		console.log('test');
		keydown.push(event);
		keydown = keydown;
	}

	function onKeyPress(event: KeyboardEvent) {
		keypress.push(event);
		keypress = keypress;
	}

	function onKeyUp(event: KeyboardEvent) {
		keyup.push(event);
		keyup = keyup;
	}
</script>

<h1 class="text-white text-4xl font-bold mt-5">Keydown</h1>
<div class="text-white flex flex-wrap bg-gray-900 h-20">
	{#each keydown as event}
		<div class="bg-red-900 p-2">
			{event.key}
		</div>
        <div class="bg-green-900 p-2">
            {event.code}
        </div>
	{/each}
</div>
<h1 class="text-white text-4xl font-bold mt-5">Keypress</h1>
<div class="text-white flex flex-wrap bg-gray-900 h-20">
	{#each keypress as event}
    <div class="bg-red-900 p-2">
        {event.key}
    </div>
    <div class="bg-green-900 p-2">
        {event.code}
    </div>
	{/each}
</div>
<h1 class="text-white text-4xl font-bold mt-5">Keyup</h1>
<div class="text-white flex flex-wrap bg-gray-900 h-20">
	{#each keyup as event}
    <div class="bg-red-900 p-2">
        {event.key}
    </div>
    <div class="bg-green-900 p-2">
        {event.code}
    </div>
	{/each}
</div>

<svelte:window on:keydown={onKeyDown} on:keypress={onKeyPress} on:keyup={onKeyUp} />
