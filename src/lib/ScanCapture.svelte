<script lang="ts">
	import { isScanning } from '$lib/store';
    export let text: string | null = null;
    let charArray: string[] = [];

    async function onKeydown(event: KeyboardEvent) {
		if (event.key.length == 1) {
			charArray.push(event.key);
		} else if (event.key == 'Tab' && charArray.length >= 5) {
			event.preventDefault();
			console.log(charArray.join(''));
			text = charArray.join('');
			charArray = [];
		} else if (event.key == 'Unidentified') {
			isScanning.set('true');
		}
	}

	async function onKeyup(event: KeyboardEvent) {
		if (event.key == 'Unidentified' && $isScanning == 'true') {
			isScanning.set('false');
			if (charArray.length >= 5) {
				text = charArray.join('');
				charArray = [];
			}
		}
	}

	function clearArray() {
		charArray = [];
	}
</script>

<svelte:window
	on:keydown={onKeydown}
	on:keyup={onKeyup}
	on:mousemove={clearArray}
	on:scroll={clearArray}
/>