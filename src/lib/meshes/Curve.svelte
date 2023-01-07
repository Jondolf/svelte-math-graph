<script lang="ts">
	import { CoordinateSystem, DefinedRanges, Line, type Point } from '$lib';
	import { toCartesian } from '$lib/coordinate-system';
	import type { EvalFunction, Variable, Variables } from '$lib/types';
	import {
		compileMathExpression,
		evaluateMathExpression,
		getConfiguredVars,
		mathScopeFromVariables,
		parseFunctionString
	} from '$lib/utils';

	const DEFAULT_VAR_CONFIG: Variables = {
		// Cartesian
		x: { ranges: new DefinedRanges([[-20, 20]]) },
		y: { ranges: new DefinedRanges([[-20, 20]]) },
		// Polar
		rho: { ranges: new DefinedRanges([[0, 20]]) },
		phi: { ranges: new DefinedRanges([[0, 2 * Math.PI]]) }
	};

	const COORDINATE_SYSTEM_AXES: { [key in CoordinateSystem]: string[] } = {
		cartesian: ['x', 'y'],
		polar: ['rho', 'phi'],
		spherical: [] // Not in 2D
	};

	// Config
	export let coordinateSystem: CoordinateSystem = CoordinateSystem.Cartesian;
	export let curveFunction = '';
	export let variables: Variables;
	export let detail = 100;
	export let material: THREE.LineBasicMaterialParameters = { color: 0xffffff };

	// Variables
	let [functionVars, functionExpression]: [string[], string] = parseFunctionString(curveFunction);
	let configuredVars = getConfiguredVars(DEFAULT_VAR_CONFIG, variables);
	let axes = COORDINATE_SYSTEM_AXES[coordinateSystem];
	let points: Point[] = [];
	$: evalFunction = compileMathExpression(functionExpression);

	// Watchers
	$: [functionVars, functionExpression] = parseFunctionString(curveFunction);
	$: configuredVars = getConfiguredVars(DEFAULT_VAR_CONFIG, variables);
	$: if (coordinateSystem !== undefined && variables) {
		axes = COORDINATE_SYSTEM_AXES[coordinateSystem];
	}
	$: coordinateSystem !== undefined &&
		curveFunction &&
		configuredVars &&
		detail &&
		updatePositions();

	// Init
	updatePositions();

	function updatePositions() {
		if (!evalFunction) {
			return;
		}

		points = [];
		setPoints(points, evalFunction);
	}

	function setPoints(points: Point[], evalFunction: EvalFunction) {
		const var1 = configuredVars[functionVars[0]];

		if (!var1 || !axes.includes(functionVars[0])) {
			return;
		}

		const min = var1.ranges?.min || 0;
		const max = var1.ranges?.max || 0;

		const delta = (max - min) / (detail + 0.0000000001);
		const scope = mathScopeFromVariables(configuredVars);

		for (let val1 = min; val1 <= max; val1 += delta) {
			scope[functionVars[0]] = var1.value ?? val1;

			let val2 = evaluateMathExpression(evalFunction, scope);

			if (!val2 || isNaN(val2)) {
				val2 = 0;
			}

			points.push(toCartesian(coordinateSystem, [...mapValuesToAxes(val1, val2), 0]));
		}
	}

	function mapValuesToAxes(val1: number, val2: number): [number, number] {
		let axisValues: { [axis: string]: number } = {};
		axes.forEach((axis) => (axisValues[axis] = NaN));
		axisValues[functionVars[0]] = val1;
		const remaining = Object.entries(axisValues).find(([_, axisVal]) => isNaN(axisVal))?.[0];

		if (remaining) {
			axisValues[remaining] = val2;
		}

		return axes.map((axis) => axisValues[axis]) as [number, number];
	}
</script>

<Line {points} {material} />
