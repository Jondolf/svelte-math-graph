<script lang="ts">
	import { CoordinateSystem, DefinedRanges, Mesh, type Color } from '$lib';
	import { toCartesian } from '$lib/coordinate-system';
	import type { EvalFunction, Point, Variables } from '$lib/types';
	import {
		compileMathExpression,
		evaluateMathExpression,
		getConfiguredVars,
		mathScopeFromVariables,
		parseFunctionString
	} from '$lib/utils';
	import type { BufferGeometry } from 'three';
	import * as THREE from 'three';

	const DEFAULT_VAR_CONFIG: Variables = {
		// Cartesian
		x: { ranges: new DefinedRanges([[-20, 20]]) },
		y: { ranges: new DefinedRanges([[-20, 20]]) },
		z: { ranges: new DefinedRanges([[-20, 20]]) },
		// Spherical
		rho: { ranges: new DefinedRanges([[0, 20]]) },
		phi: { ranges: new DefinedRanges([[0, 2 * Math.PI]]) },
		theta: { ranges: new DefinedRanges([[0, Math.PI]]) }
	};

	const COORDINATE_SYSTEM_AXES: { [key in CoordinateSystem]: string[] } = {
		cartesian: ['x', 'y', 'z'],
		polar: [], // Not in 3D
		spherical: ['rho', 'phi', 'theta']
	};

	// Config
	export let coordinateSystem: CoordinateSystem = CoordinateSystem.Cartesian;
	export let surfaceFunction = '';
	export let variables: Variables = {}; // Variables defined by the user
	export let detail = 100;
	export let color: Color = 0x4488ff;
	export let opacity = 0.8;

	// Variables
	let [functionVars, functionExpression]: [string[], string] = parseFunctionString(surfaceFunction);
	let configuredVars = getConfiguredVars(DEFAULT_VAR_CONFIG, variables);
	let axes = COORDINATE_SYSTEM_AXES[coordinateSystem];
	let geometry: BufferGeometry = new THREE.PlaneGeometry(1, 1, detail, detail).rotateX(
		-Math.PI / 2
	);
	$: material = new THREE.MeshPhongMaterial({
		color,
		side: THREE.TwoPassDoubleSide,
		transparent: true,
		opacity,
		flatShading: true
	});
	$: evalFunction = compileMathExpression(functionExpression);

	// Watchers
	$: [functionVars, functionExpression] = parseFunctionString(surfaceFunction);
	$: configuredVars = getConfiguredVars(DEFAULT_VAR_CONFIG, variables);
	$: if (coordinateSystem !== undefined && variables) {
		axes = COORDINATE_SYSTEM_AXES[coordinateSystem];
	}
	$: coordinateSystem !== undefined && surfaceFunction && configuredVars && updatePositions(false);
	$: detail && updatePositions(true);

	// Init
	updatePositions(true);

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
		const var1 = configuredVars[functionVars[0]];
		const var2 = configuredVars[functionVars[1]];

		if (!var1 || !var2 || !axes.includes(functionVars[0]) || !axes.includes(functionVars[1])) {
			return;
		}

		const position = geometry.attributes.position;

		const var1Ranges = var1.ranges || new DefinedRanges();
		const var2Ranges = var2.ranges || new DefinedRanges();

		const deltaVar1 = (var1Ranges.max - var1Ranges.min) / (detail + 0.0000000001);
		const deltaVar2 = (var2Ranges.max - var2Ranges.min) / (detail + 0.0000000001);

		const scope = mathScopeFromVariables(configuredVars);

		let i = 0;
		for (let val1 = var1Ranges.min; val1 <= var1Ranges.max; val1 += deltaVar1) {
			for (let val2 = var2Ranges.min; val2 <= var2Ranges.max; val2 += deltaVar2) {
				scope[functionVars[0]] = var1.value ?? val1;
				scope[functionVars[1]] = var2.value ?? val2;

				let val3 = evaluateMathExpression(evalFunction, scope);

				if (!val3 || isNaN(val3)) {
					val3 = 0;
				}

				const [x, y, z] = toCartesian(coordinateSystem, mapValuesToAxes(val1, val2, val3));

				position.setX(i, x);
				position.setY(i, z);
				position.setZ(i, y);

				i++;
			}
		}

		return geometry;
	}

	function mapValuesToAxes(val1: number, val2: number, val3: number): [number, number, number] {
		let axisValues: { [axis: string]: number } = {};
		axes.forEach((axis) => (axisValues[axis] = NaN));
		axisValues[functionVars[0]] = val1;
		axisValues[functionVars[1]] = val2;
		const remaining = Object.entries(axisValues).find(([_, axisVal]) => isNaN(axisVal))?.[0];

		if (remaining) {
			axisValues[remaining] = val3;
		}

		return axes.map((axis) => axisValues[axis]) as Point;
	}
</script>

<Mesh {geometry} {material} />
