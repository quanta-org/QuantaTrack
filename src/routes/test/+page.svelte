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
<div class="flex overflow-x-auto">
    <table class="text-white bg-gray-900 overflow-x-auto">
        <tr>
            <th>Key</th>
            <th>altKey</th>
            <th>cthlKey</th>
            <th>metaKey</th>
            <th>shiftKey</th>
            <th>keyCode</th>
            <th>charCode</th>
            <th>location</th>
            <th>bubbles</th>
            <th>code</th>
            <th>composed</th>
            <th>detail</th>
            <th>DOM left</th>
            <th>DOM right</th>
            <th>DOM standard</th>
            <th>DOM numpad</th>
            <th>Target</th>
            <th>isTrusted</th>
            <th>view</th>
            <th>Return value</th>
            <th>Cancellable</th>
            <th>Type</th>
            <th>At target</th>
            <th>None?</th>
            <th>Src element</th>
        </tr>
        {#each keydown as event}
            <tr>
                <td>{event.key}</td>
                <td>{event.altKey}</td>
                <td>{event.ctrlKey}</td>
                <td>{event.metaKey}</td>
                <td>{event.shiftKey}</td>
                <td>{event.keyCode}</td>
                <td>{event.charCode}</td>
                <td>{event.location}</td>
                <td>{event.bubbles}</td>
                <td>{event.code}</td>
                <td>{event.composed}</td>
                <td>{event.detail}</td>
                <td>{event.DOM_KEY_LOCATION_LEFT}</td>
                <td>{event.DOM_KEY_LOCATION_RIGHT}</td>
                <td>{event.DOM_KEY_LOCATION_STANDARD}</td>
                <td>{event.DOM_KEY_LOCATION_NUMPAD}</td>
                <td>{event.currentTarget}</td>
                <td>{event.isTrusted}</td>
                <td>{event.view}</td>
                <td>{event.returnValue}</td>
                <td>{event.cancelable}</td>
                <td>{event.type}</td>
                <td>{event.AT_TARGET}</td>
                <td>{event.NONE}</td>
                <td>{event.srcElement}</td>
            </tr>
        {/each}
    </table>
</div>

<h1 class="text-white text-4xl font-bold mt-5">Keyup</h1>
<div class="flex overflow-x-auto">
    <table class="text-white bg-gray-900 overflow-x-auto border">
        <tr>
            <th>Key</th>
            <th>altKey</th>
            <th>cthlKey</th>
            <th>metaKey</th>
            <th>shiftKey</th>
            <th>keyCode</th>
            <th>charCode</th>
            <th>location</th>
            <th>bubbles</th>
            <th>code</th>
            <th>composed</th>
            <th>detail</th>
            <th>DOM left</th>
            <th>DOM right</th>
            <th>DOM standard</th>
            <th>DOM numpad</th>
            <th>Target</th>
            <th>isTrusted</th>
            <th>view</th>
            <th>Return value</th>
            <th>Cancellable</th>
            <th>Type</th>
            <th>At target</th>
            <th>None?</th>
            <th>Src element</th>
        </tr>
        {#each keyup as event}
            <tr>
                <td>{event.key}</td>
                <td>{event.altKey}</td>
                <td>{event.ctrlKey}</td>
                <td>{event.metaKey}</td>
                <td>{event.shiftKey}</td>
                <td>{event.keyCode}</td>
                <td>{event.charCode}</td>
                <td>{event.location}</td>
                <td>{event.bubbles}</td>
                <td>{event.code}</td>
                <td>{event.composed}</td>
                <td>{event.detail}</td>
                <td>{event.DOM_KEY_LOCATION_LEFT}</td>
                <td>{event.DOM_KEY_LOCATION_RIGHT}</td>
                <td>{event.DOM_KEY_LOCATION_STANDARD}</td>
                <td>{event.DOM_KEY_LOCATION_NUMPAD}</td>
                <td>{event.currentTarget}</td>
                <td>{event.isTrusted}</td>
                <td>{event.view}</td>
                <td>{event.returnValue}</td>
                <td>{event.cancelable}</td>
                <td>{event.type}</td>
                <td>{event.AT_TARGET}</td>
                <td>{event.NONE}</td>
                <td>{event.srcElement}</td>
            </tr>
        {/each}
    </table>
</div>

<h1 class="text-white text-4xl font-bold mt-5">Keypress</h1>
<div class="flex overflow-x-auto">
    <table class="text-white bg-gray-900 overflow-x-auto">
        <tr>
            <th>Key</th>
            <th>altKey</th>
            <th>cthlKey</th>
            <th>metaKey</th>
            <th>shiftKey</th>
            <th>keyCode</th>
            <th>charCode</th>
            <th>location</th>
            <th>bubbles</th>
            <th>code</th>
            <th>composed</th>
            <th>detail</th>
            <th>DOM left</th>
            <th>DOM right</th>
            <th>DOM standard</th>
            <th>DOM numpad</th>
            <th>Target</th>
            <th>isTrusted</th>
            <th>view</th>
            <th>Return value</th>
            <th>Cancellable</th>
            <th>Type</th>
            <th>At target</th>
            <th>None?</th>
            <th>Src element</th>
        </tr>
        {#each keypress as event}
            <tr>
                <td>{event.key}</td>
                <td>{event.altKey}</td>
                <td>{event.ctrlKey}</td>
                <td>{event.metaKey}</td>
                <td>{event.shiftKey}</td>
                <td>{event.keyCode}</td>
                <td>{event.charCode}</td>
                <td>{event.location}</td>
                <td>{event.bubbles}</td>
                <td>{event.code}</td>
                <td>{event.composed}</td>
                <td>{event.detail}</td>
                <td>{event.DOM_KEY_LOCATION_LEFT}</td>
                <td>{event.DOM_KEY_LOCATION_RIGHT}</td>
                <td>{event.DOM_KEY_LOCATION_STANDARD}</td>
                <td>{event.DOM_KEY_LOCATION_NUMPAD}</td>
                <td>{event.currentTarget}</td>
                <td>{event.isTrusted}</td>
                <td>{event.view}</td>
                <td>{event.returnValue}</td>
                <td>{event.cancelable}</td>
                <td>{event.type}</td>
                <td>{event.AT_TARGET}</td>
                <td>{event.NONE}</td>
                <td>{event.srcElement}</td>
            </tr>
        {/each}
    </table>
</div>

<svelte:window on:keydown={onKeyDown} on:keypress={onKeyPress} on:keyup={onKeyUp} />
