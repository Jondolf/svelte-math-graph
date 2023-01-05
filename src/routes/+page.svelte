<script lang="ts">
	import {
		AmbientLight,
		ColorPicker,
		CoordinateSystem,
		CoordinateAxes,
		Curve,
		DirectionalLight,
		Graph,
		OrbitCamera,
		Surface
	} from '$lib';
	import { onMount } from 'svelte';

	export let equation: string = 'sin(16phi+t)';

	// weird spiral '1000sin(theta*phi+5t)'
	// torus-like shape that warps into itself '1000sin(theta+t)'
	// water droplet pattern 'sin((x^2+y^2)*((sin(t)+1)/20)+t/2)'

	let graphWidth: number;
	let graphHeight: number;

	let backgroundColor: string = '#000000';
	let surfaceColor: string = '#0055ff';

	let time = 0;

	let meshDetail = 50;

	let xRange = 20;
	let yRange = 20;

	let curveVisible = false;
	let surfaceVisible = true;

	onMount(() => requestAnimationFrame(animate));

	function animate() {
		requestAnimationFrame(animate);
		time = performance.now() / 1000;
	}
</script>

<svelte:window bind:innerWidth={graphWidth} bind:innerHeight={graphHeight} />

<div class="controls">
	<label for="detail">detail ({meshDetail})</label>
	<input
		type="range"
		name="detail"
		id="detail"
		min="2"
		max="200"
		step="1"
		bind:value={meshDetail}
	/>

	<label for="xRange">x range (-{xRange}...{xRange})</label>
	<input type="range" name="xRange" id="xRange" min="1" max="100" step="1" bind:value={xRange} />

	<label for="yRange">y range (-{yRange}...{yRange})</label>
	<input type="range" name="yRange" id="yRange" min="1" max="100" step="1" bind:value={yRange} />

	<input type="checkbox" name="curveVisible" id="curveVisible" bind:checked={curveVisible} />
	<label for="curveVisible">curve visible</label>

	<br />

	<input type="checkbox" name="surfaceVisible" id="surfaceVisible" bind:checked={surfaceVisible} />
	<label for="surfaceVisible">surface visible</label>

	<br />

	<label for="equation">equation</label>
	<input type="text" name="equation" id="equation" bind:value={equation} />

	<br />

	<span>surface color</span>

	<br />

	<ColorPicker bind:hex={surfaceColor} />

	<br />

	<span>background color</span>

	<br />

	<ColorPicker bind:hex={backgroundColor} />
</div>

<Graph width={graphWidth} height={graphHeight} {backgroundColor}>
	<OrbitCamera aspect={graphWidth / graphHeight} far={100_000} position={[0, 0, 10]} />
	<DirectionalLight intensity={1} position={[0.5, 0.1, 0.5]} />
	<DirectionalLight intensity={1} position={[0.2, -0.1, 0.5]} />
	<AmbientLight intensity={0.0} />

	<CoordinateAxes />

	{#if curveVisible}
		<Curve
			{equation}
			{time}
			segmentCount={meshDetail}
			xMin={-xRange}
			xMax={xRange}
			yMin={-yRange}
			yMax={yRange}
			material={{ color: 0x000000 }}
		/>
	{/if}
	{#if surfaceVisible}
		<Surface
			coordinateSystem={CoordinateSystem.Spherical}
			{equation}
			{time}
			xMin={-xRange}
			xMax={xRange}
			yMin={-yRange}
			yMax={yRange}
			xSegments={meshDetail}
			ySegments={meshDetail}
			color={surfaceColor}
		/>
	{/if}
</Graph>

<style lang="scss">
	:global(body) {
		margin: 0;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
			Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	}

	.controls {
		position: absolute;
		top: 0;
		bottom: 0;
		padding: 1rem;
		box-sizing: border-box;
		color: white;
		background-color: #00000055;
	}

	input[type='checkbox'] {
		display: inline;
	}

	input {
		display: block;
	}
</style>
