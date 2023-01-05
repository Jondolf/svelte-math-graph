<script lang="ts">
	import { onDestroy } from 'svelte';
	import * as THREE from 'three';
	import type { Point } from '$lib/types';
	import { graphScene } from '$lib/stores';

	// Config
	export let points: Point[] = [];
	export let material: THREE.LineBasicMaterialParameters = { color: 0xffffff };

	// Variables
	let line: THREE.Line = new THREE.Line(
		new THREE.BufferGeometry(),
		new THREE.LineBasicMaterial(material)
	);

	// Watchers
	$: points.length && updatePoints();
	$: points && updatePointPositions();
	$: line.material = new THREE.LineBasicMaterial(material);

	// Init
	updatePoints();
	$graphScene.add(line);

	// Dispose
	onDestroy(() => {
		line.geometry.dispose();
		line.removeFromParent();
	});

	function updatePoints() {
		line.geometry.setAttribute(
			'position',
			new THREE.BufferAttribute(new Float32Array(points.length * 3), 3)
		);
		line.geometry.setDrawRange(0, points.length);
	}

	function updatePointPositions() {
		let position = line.geometry.attributes.position;

		for (const [i, point] of points.entries()) {
			position.setX(i, point[0]);
			position.setY(i, point[2]);
			position.setZ(i, point[1]);
		}

		line.geometry.attributes.position.needsUpdate = true;
	}
</script>
