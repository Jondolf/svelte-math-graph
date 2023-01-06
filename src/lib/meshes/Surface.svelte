<script lang="ts">
	import { CoordinateSystem, DefinedRanges, Mesh, type Color } from '$lib';
	import { toCartesian } from '$lib/coordinate-system';
	import type { EvalFunction, Variable, Variables } from '$lib/types';
	import {
		compileMathExpression,
		evaluateMathExpression,
		mathScopeFromVariables
	} from '$lib/utils';
	import type { BufferGeometry } from 'three';
	import * as THREE from 'three';

	// Config
	export let coordinateSystem: CoordinateSystem = CoordinateSystem.Cartesian;
	export let equation = '';
	export let variables: Variables = {
		x: { ranges: new DefinedRanges([[-10, 10]]) },
		y: { ranges: new DefinedRanges([[-10, 10]]) },
		z: {}
	};
	export let detail = 50;
	export let color: Color = 0x4488ff;

	// Variables
	let axes = getAxes();
	let axisVars: (Variable | undefined)[] = axes.map((axis) => variables[axis]);
	let geometry: BufferGeometry = new THREE.PlaneGeometry(1, 1, detail, detail).rotateX(
		-Math.PI / 2
	);
	$: material = new THREE.MeshPhongMaterial({
		color,
		side: THREE.DoubleSide,
		shadowSide: THREE.BackSide,
		flatShading: true
	});
	$: evalFunction = compileMathExpression(equation);

	// Watchers
	$: coordinateSystem !== undefined && variables && updateAxes();
	$: coordinateSystem !== undefined && equation && variables && updatePositions(false);
	$: detail && updatePositions(true);

	// Init
	updatePositions(true);

	function updateAxes() {
		axisVars = axes.map((axis) => variables[axis]);
		axes = getAxes();
	}

	function getAxes(): string[] {
		switch (coordinateSystem) {
			case CoordinateSystem.Cartesian:
				return ['x', 'y', 'z'];
			case CoordinateSystem.Spherical:
				return ['rho', 'phi', 'theta'];
		}
		return [];
	}

	function updatePositions(rebuildGeometry: boolean) {
		if (!evalFunction) {
			return;
		}

		if (rebuildGeometry) {
			geometry = new THREE.PlaneGeometry(1, 1, detail, detail).rotateX(-Math.PI / 2);
		}

		setPoints(geometry, evalFunction);
		geometry.computeVertexNormals();
		geometry.attributes.position.needsUpdate = true;
	}

	function setPoints(geometry: THREE.BufferGeometry, evalFunction: EvalFunction) {
		if (!axisVars[0] || !axisVars[1]) {
			return;
		}

		const position = geometry.attributes.position;

		const var1Ranges = axisVars[0].ranges || new DefinedRanges();
		const var2Ranges = axisVars[1].ranges || new DefinedRanges();

		const deltaVar1 = (var1Ranges.max - var1Ranges.min) / (detail + 0.0000000001);
		const deltaVar2 = (var2Ranges.max - var2Ranges.min) / (detail + 0.0000000001);

		const scope = mathScopeFromVariables(variables);

		let i = 0;
		for (let var1 = var1Ranges.min; var1 <= var1Ranges.max; var1 += deltaVar1) {
			for (let var2 = var2Ranges.min; var2 <= var2Ranges.max; var2 += deltaVar2) {
				scope[axes[0]] = axisVars[0].value ?? var1;
				scope[axes[1]] = axisVars[1].value ?? var2;

				let var3 = evaluateMathExpression(evalFunction, scope);

				if (!var3 || isNaN(var3)) {
					var3 = 0;
				}

				const [x, y, z] = toCartesian(coordinateSystem, [var1, var2, var3]);
				position.setX(i, x);
				position.setY(i, z);
				position.setZ(i, y);
				i++;
			}
		}

		return geometry;
	}
</script>

<Mesh {geometry} {material} />
