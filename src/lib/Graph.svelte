<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import * as THREE from 'three';
	import { WebGLRenderer } from 'three';
	import { graphCanvas, graphHeight, graphRenderer, graphScene, graphWidth } from './stores';
	import type { Color } from './types';

	// Config
	export let width = 1920;
	export let height = 1080;
	export let backgroundColor: Color = 0x000000;

	// Variables
	let canvas: HTMLCanvasElement;

	// Watchers
	$: resize(width, height);
	$: $graphScene.background = new THREE.Color(backgroundColor);
	$: $graphCanvas = canvas;

	// Init
	// Note: This component doesn't actually render anything. Cameras handle the rendering.
	onMount(() => {
		$graphRenderer = new WebGLRenderer({ canvas, antialias: true });
		$graphRenderer.setSize(width, height);
	});

	// Dispose
	onDestroy(() => $graphRenderer?.dispose());

	function resize(width: number, height: number) {
		$graphWidth = width;
		$graphHeight = height;

		if ($graphRenderer) {
			const pixelRatio = window.devicePixelRatio;
			$graphRenderer.setSize(width * pixelRatio, height * pixelRatio);
			$graphRenderer.domElement.style.width = width + 'px';
			$graphRenderer.domElement.style.height = height + 'px';
		}
	}
</script>

<canvas class="math-graph" bind:this={canvas} />
<slot />

<style lang="scss">
	canvas {
		vertical-align: top;
	}
</style>
