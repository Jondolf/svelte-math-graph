<script lang="ts">
	import { DirectionalLight, Graph, PerspectiveCamera, Surface } from '$lib';
	import { onMount } from 'svelte';

	let windowWidth = 0;
	let windowHeight = 0;
	let headerWidth = 0;
	let headerHeight = 0;
	let time = 0;

	onMount(() => requestAnimationFrame(updateTime));

	function updateTime() {
		requestAnimationFrame(updateTime);
		time = performance.now() / 1000;
	}
</script>

<svelte:head>
	<title>Svelte Math Graph</title>
	<meta
		name="description"
		content="Svelte Math Graph (SMG) is a Svelte component library for creating mathematical graphs and visualizations with a declarative component-oriented API that focuses on ease of use, configurability, and extensibility."
	/>
</svelte:head>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />

<header bind:clientWidth={headerWidth} bind:clientHeight={headerHeight}>
	<div>
		<h1>
			<span>S</span>velte<br />
			<span>M</span>ath<br />
			<span>G</span>raph<br />
		</h1>
		<div class="description">
			<p>
				<strong>Svelte Math Graph (SMG)</strong> is a Svelte component library for creating mathematical
				graphs and visualizations with a declarative component-oriented API that focuses on ease of use,
				configurability, and extensibility.
			</p>
			<a href="/examples">See examples</a>
		</div>
	</div>
</header>

<Graph backgroundColor={0xffccbb} width={windowWidth} height={windowHeight - headerHeight}>
	<PerspectiveCamera position={[30, 60, 60]} lookAt={[0, 0, 0]} />
	<DirectionalLight intensity={2} position={[0.75, 1, 0.75]} target={[0, 0, 0]} />
	<Surface
		surfaceFunction={'f(x, y) = sin(x + 10t)'}
		variables={{ t: { value: time } }}
		color={0xff2222}
	/>
</Graph>

<style lang="scss">
	:global(body) {
		margin: 0;

		::selection {
			background-color: #ffaaaa;
			color: black;
		}
	}

	header {
		width: 100%;
		min-height: 20rem;
		height: 40vh;
		padding: 2rem;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
			Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		box-shadow: 0 0 3rem #ffaaaa;

		> div {
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 2rem;
		}
	}

	h1 {
		height: 100%;
		font-size: 4.25em;
		margin: 0;
		padding: 0;
		color: black;

		span {
			color: #ff3e00;
		}
	}

	.description {
		max-width: 50rem;
		height: 22rem;
		padding-top: 2.5rem;
		box-sizing: border-box;

		p {
			color: black;
			font-size: 1.5em;
		}

		a {
			font-weight: bold;
			font-size: 1.5em;
			color: #ff3e00;
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}
		}
	}
</style>
