<script lang="ts">
	import { graphScene } from '$lib/stores';
	import { onDestroy } from 'svelte';
	import * as THREE from 'three';

	// Config
	export let geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
	export let material: THREE.Material = new THREE.MeshPhongMaterial({
		color: 0xaaaaaa,
		side: THREE.DoubleSide
	});

	// Variables
	let mesh: THREE.Mesh = new THREE.Mesh(geometry, material);

	// Watchers
	$: mesh.geometry = geometry;
	$: mesh.material = material;

	// Init
	$graphScene.add(mesh);

	// Dispose
	onDestroy(() => {
		mesh.geometry.dispose();
		mesh.removeFromParent();
	});
</script>
