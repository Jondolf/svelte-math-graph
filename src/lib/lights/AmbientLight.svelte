<script lang="ts">
	import { onDestroy } from 'svelte';
	import * as THREE from 'three';
	import type { Color } from '$lib/types';
	import { graphScene } from '$lib/stores';

	// Config
	export let color: Color = 0xffffff;
	export let intensity = 1;

	// Variables
	let light = new THREE.AmbientLight(color, intensity);

	// Watchers
	$: light.color = new THREE.Color(color);
	$: light.intensity = intensity;

	// Init
	$graphScene.add(light);

	// Dispose
	onDestroy(() => {
		light.dispose();
		light.removeFromParent();
	});
</script>
