<script lang="ts">
	import { HSLToHex } from './utils';

	let hue = 0;
	let saturation = 100;
	let lightness = 50;

	export let hex = HSLToHex(hue, saturation, lightness);
	$: hex = HSLToHex(hue, saturation, lightness);
</script>

<label for="hue">hue ({hue})</label>
<input type="range" name="hue" id="hue" min="0" max="360" step="1" bind:value={hue} />

<label for="saturation">saturation ({saturation})</label>
<input
	type="range"
	name="saturation"
	id="saturation"
	min="0"
	max="100"
	step="1"
	bind:value={saturation}
/>

<label for="lightness">lightness ({lightness})</label>
<input
	type="range"
	name="lightness"
	id="lightness"
	min="0"
	max="100"
	step="1"
	bind:value={lightness}
/>

<style lang="scss">
	input {
		display: block;
	}
</style>
