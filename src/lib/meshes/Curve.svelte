<script lang="ts">
	import { CoordinateSystem, DefinedRanges, Line, type Point } from '$lib';
	import { toCartesian } from '$lib/coordinate-system';
	import type { EvalFunction, Variable, Variables } from '$lib/types';
	import {
		compileMathExpression,
		evaluateMathExpression,
		mathScopeFromVariables
	} from '$lib/utils';

	// Config
	export let coordinateSystem: CoordinateSystem = CoordinateSystem.Cartesian;
	export let equation = '';
	export let variables: Variables = {
		x: { ranges: new DefinedRanges([[-10, 10]]) },
		y: {}
	};
	export let detail = 10;
	export let material: THREE.LineBasicMaterialParameters = { color: 0xffffff };

	// Variables
	let axes = getAxes();
	let axisVars: (Variable | undefined)[] = axes.map((axis) => variables[axis]);
	let points: Point[] = [];
	$: evalFunction = compileMathExpression(equation);

	// Watchers
	$: coordinateSystem !== undefined && variables && updateAxes();
	$: coordinateSystem !== undefined && equation && variables && detail && updatePositions();

	// Init
	updatePositions();

	function updateAxes() {
		axisVars = axes.map((axis) => variables[axis]);
		axes = getAxes();
	}

	function getAxes(): string[] {
		switch (coordinateSystem) {
			case CoordinateSystem.Cartesian:
				return ['x', 'y'];
			case CoordinateSystem.Polar:
				return ['rho', 'phi'];
		}
		return [];
	}

	function updatePositions() {
		if (!evalFunction) {
			return;
		}

		points = [];
		setPoints(points, evalFunction);
	}

	function setPoints(points: Point[], evalFunction: EvalFunction) {
		if (!axisVars[0]) {
			return;
		}

		const min = axisVars[0].ranges?.min || 0;
		const max = axisVars[0].ranges?.max || 0;

		const delta = (max - min) / (detail + 0.0000000001);
		const scope = mathScopeFromVariables(variables);

		for (let var1 = min; var1 <= max; var1 += delta) {
			scope[axes[0]] = axisVars[0].value ?? var1;

			let var2 = evaluateMathExpression(evalFunction, scope);

			if (!var2 || isNaN(var2)) {
				var2 = 0;
			}

			points.push(toCartesian(coordinateSystem, [var1, var2, 0]));
		}
	}
</script>

<Line {points} {material} />
