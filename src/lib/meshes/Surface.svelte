<script lang="ts">
	import { CoordinateSystem, Mesh, type Color } from '$lib';
	import { sphericalToCartesian } from '$lib/coordinate-system';
	import type { EvalFunction } from '$lib/types';
	import { compileMathExpression, evaluateMathExpression } from '$lib/utils';
	import type { BufferGeometry } from 'three';
	import * as THREE from 'three';

	// Config
	export let coordinateSystem: CoordinateSystem = CoordinateSystem.Spherical;
	export let equation = '';
	export let xMin = -20;
	export let xMax = 20;
	export let yMin = -20;
	export let yMax = 20;
	export let xSegments = 10;
	export let ySegments = 10;
	export let time = 0;
	export let color: Color = 0x4488ff;

	// Variables
	let geometry: BufferGeometry = new THREE.SphereGeometry(xMax - xMin, xSegments, ySegments);
	$: material = new THREE.MeshPhongMaterial({
		color,
		side: THREE.DoubleSide,
		shadowSide: THREE.BackSide,
		flatShading: true
	});
	$: evalFunction = compileMathExpression(equation);

	// Watchers
	$: equation && updatePositions(false);
	$: time && updatePositions(false);
	$: xMin && xMax && yMin && yMax && xSegments && ySegments && updatePositions(true);

	// Init
	updatePositions(true);

	function updatePositions(rebuildGeometry: boolean) {
		if (!evalFunction) {
			return;
		}

		switch (coordinateSystem) {
			case CoordinateSystem.Cartesian:
				if (rebuildGeometry) {
					geometry = new THREE.PlaneGeometry(
						xMax - xMin,
						yMax - yMin,
						xSegments,
						ySegments
					).rotateX(-Math.PI / 2);
				}
				setPointsCartesian(geometry, evalFunction);
				break;
			case CoordinateSystem.Spherical:
				if (rebuildGeometry) {
					geometry = new THREE.SphereGeometry(xMax - xMin, xSegments, ySegments);
				}
				setPointsSpherical(geometry, evalFunction);
				break;
		}

		geometry.computeVertexNormals();
		geometry.attributes.position.needsUpdate = true;
	}

	function setPointsCartesian(geometry: THREE.BufferGeometry, evalFunction: EvalFunction) {
		const position = geometry.attributes.position;

		for (let i = 0; i < position.count; i++) {
			let x = position.getX(i);
			const y = position.getZ(i);
			const z = evaluateMathExpression(evalFunction, { x, y, t: time });

			if (!z || isNaN(z)) {
				continue;
			}

			position.setY(i, z);
		}

		return geometry;
	}

	function setPointsSpherical(geometry: BufferGeometry, evalFunction: EvalFunction) {
		const position = geometry.attributes.position;

		// A tiny extra to hide seam
		let deltaPhi = (2 * Math.PI) / (xSegments + 0.0000001);
		let deltaTheta = Math.PI / (ySegments + 0.0000001);
		let i = 0;

		for (let theta = 0; theta < Math.PI; theta += deltaTheta) {
			for (let phi = 0; phi < 2 * Math.PI; phi += deltaPhi) {
				let rho = evaluateMathExpression(evalFunction, { phi, theta, t: time });

				if (!rho || isNaN(rho)) {
					continue;
				}

				const [x, y, z] = sphericalToCartesian(rho, phi, theta);

				position.setX(i, x);
				position.setZ(i, y);
				position.setY(i, z);
				i++;
			}
		}
	}
</script>

<Mesh {geometry} {material} />
