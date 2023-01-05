<script lang="ts">
	import { onDestroy } from 'svelte';
	import * as THREE from 'three';
	import type { Color, Point } from '$lib/types';
	import { graphScene } from '$lib/stores';

	// Config
	export let color: Color = 0xffffff;
	export let intensity = 1;
	export let position: Point = [1, 1, 1];
	export let target: Point = [0, 0, 0];

	// Variables
	let light = new THREE.DirectionalLight(color, intensity);

	// Watchers
	$: light.color = new THREE.Color(color);
	$: light.intensity = intensity;
	$: light.position.set(position[0], position[1], position[2]);
	$: light.target.position.set(target[0], target[1], target[2]);

	// Init
	light.position.set(position[0], position[1], position[2]);
	light.target.position.set(target[0], target[1], target[2]);
	light.castShadow = true;
	light.shadow.camera.far = 10000;
	light.shadow.camera.castShadow = true;
	$graphScene.add(light);
	$graphScene.add(light.target);

	// Dispose
	onDestroy(() => {
		light.dispose();
		light.removeFromParent();
	});
</script>
