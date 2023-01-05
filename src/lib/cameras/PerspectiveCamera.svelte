<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import * as THREE from 'three';
	import type { Point } from '$lib/types';
	import { graphHeight, graphRenderer, graphScene, graphWidth } from '$lib/stores';

	// Config
	export let fov = 45;
	export let aspect = 16 / 9;
	export let near = 1;
	export let far = 1000;
	export let position: Point = [0, 0, 0];
	export let lookAt: Point | null = [0, 0, 0];

	// Variables
	export let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

	// Watchers
	$: $graphWidth && $graphHeight && camera.updateProjectionMatrix();
	$: {
		camera.fov = fov;
		camera.updateProjectionMatrix();
	}
	$: {
		camera.aspect = aspect;
		camera.updateProjectionMatrix();
	}
	$: {
		camera.near = near;
		camera.updateProjectionMatrix();
	}
	$: {
		camera.far = far;
		camera.updateProjectionMatrix();
	}
	$: camera.position.set(position[0], position[1], position[2]);
	$: lookAt && camera.lookAt(new THREE.Vector3(lookAt[0], lookAt[1], lookAt[2]));

	// Init
	camera.position.set(position[0], position[1], position[2]);
	$graphScene.add(camera);

	onMount(() => requestAnimationFrame(animate));

	// Dispose
	onDestroy(() => camera.removeFromParent());

	function animate() {
		requestAnimationFrame(animate);
		$graphRenderer.render($graphScene, camera);
	}
</script>
