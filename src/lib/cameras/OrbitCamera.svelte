<script lang="ts">
	import { getContext, onDestroy, onMount } from 'svelte';
	import * as THREE from 'three';
	// @ts-ignore
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { PerspectiveCamera, type Point } from '$lib';
	import { graphCanvas, graphRenderer } from '$lib/stores';

	// Config
	export let fov = 45;
	export let aspect = 16 / 9;
	export let near = 1;
	export let far = 1000;
	export let target: Point = [0, 0, 0];
	// Gets overwritten whenever the camera moves via OrbitControls
	export let position: Point = [0, 0, 0];

	// Variables
	let camera: THREE.PerspectiveCamera;
	let controls: OrbitControls;
	$: $graphCanvas && camera && initControls();

	// Watchers
	$: camera?.position.set(position[0], position[1], position[2]);
	$: if (controls) {
		controls.target = new THREE.Vector3(target[0], target[1], target[2]);
	}

	// Dispose
	onDestroy(() => controls?.dispose());

	function initControls() {
		controls = new OrbitControls(camera, $graphCanvas);

		controls.target = new THREE.Vector3(target[0], target[1], target[2]);

		controls.enableDamping = true;
		controls.dampingFactor = 0.05;

		controls.screenSpacePanning = false;

		controls.maxPolarAngle = Math.PI;

		updateControls();
	}

	function updateControls() {
		requestAnimationFrame(updateControls);
		controls?.update();
	}
</script>

<PerspectiveCamera bind:camera {fov} {aspect} {near} {far} />
