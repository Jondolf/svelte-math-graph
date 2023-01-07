<script lang="ts">
	import {
		AmbientLight,
		ColorPicker,
		CoordinateSystem,
		Curve,
		DirectionalLight,
		Graph,
		OrbitCamera,
		Surface
	} from '$lib';
	import { onMount } from 'svelte';

	export let equation: string = 'f(theta,phi)=sin(10theta)';

	// 'sin(16phi+t)'
	// weird spiral '1000sin(theta*phi+5t)'
	// torus-like shape that warps into itself '1000sin(theta+t)'
	// water droplet pattern 'sin((x^2+y^2)*((sin(t)+1)/20)+t/2)'

	let graphWidth: number;
	let graphHeight: number;

	let backgroundColor: string = '#ffccbb';
	let surfaceColor: string = '#ff2222';
	let surfaceOpacity = 0.8;

	let meshDetail = 100;

	let xRange = 10;
	let yRange = 10;

	let curveVisible = true;
	let surfaceVisible = true;

	let time = 0;

	onMount(() => requestAnimationFrame(animate));

	function animate() {
		requestAnimationFrame(animate);
		time = performance.now() / 1000;
	}
</script>

<svelte:head>
	<title>Examples - Svelte Math Graph</title>

	<meta
		name="description"
		content="Here you can try out some of the features and capabilities of Svelte Math Graph."
	/>
</svelte:head>

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

	<label for="surfaceOpacity">surface opacity ({surfaceOpacity})</label>
	<input
		type="range"
		name="surfaceOpacity"
		id="surfaceOpacity"
		min="0"
		max="1"
		step="0.1"
		bind:value={surfaceOpacity}
	/>

	<br />

	<span>background color</span>

	<br />

	<ColorPicker bind:hex={backgroundColor} />
</div>

<Graph width={graphWidth} height={graphHeight} {backgroundColor}>
	<OrbitCamera aspect={graphWidth / graphHeight} far={100_000} position={[3, 4, -4]} />
	<DirectionalLight intensity={1} position={[0.5, 0.1, 0.5]} />
	<DirectionalLight intensity={1} position={[0.2, -0.1, 0.5]} />
	<AmbientLight intensity={0.0} />

	<!--<CoordinateAxes />-->

	{#if curveVisible}
		<Curve
			coordinateSystem={CoordinateSystem.Polar}
			curveFunction={equation}
			variables={{ t: { value: time } }}
			detail={meshDetail}
			material={{ color: surfaceColor }}
		/>
	{/if}
	{#if surfaceVisible}
		<Surface
			coordinateSystem={CoordinateSystem.Spherical}
			surfaceFunction={equation}
			variables={{ t: { value: time } }}
			detail={meshDetail}
			color={surfaceColor}
			opacity={surfaceOpacity}
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
