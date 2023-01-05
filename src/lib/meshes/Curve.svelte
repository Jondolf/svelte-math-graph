<script lang="ts">
	import { Line, type Point } from '$lib';
	import { compileMathExpression, evaluateMathExpression } from '$lib/utils';

	// Config
	export let equation = '';
	export let xMin = -20;
	export let xMax = 20;
	export let yMin = -20;
	export let yMax = 20;
	export let segmentCount = 10;
	export let time = 0;
	export let material: THREE.LineBasicMaterialParameters = { color: 0xffffff };

	// Variables
	$: evalFunction = compileMathExpression(equation);
	let points: Point[] = [];

	// Watchers
	$: equation && segmentCount && time && updatePositions();
	$: xMin && xMax && yMin && yMax && segmentCount && updatePositions();
	$: time && updatePositions();

	updatePositions();

	function updatePositions() {
		if (!evalFunction) {
			return;
		}

		points = [];

		for (let i = 0; i < segmentCount; i++) {
			const percentX = i / (segmentCount - 1);
			const x = percentX * (xMax - xMin) + xMin;
			let y = evaluateMathExpression(evalFunction, { x, t: time });

			if (!y || isNaN(y)) {
				y = 0;
			}

			points.push([x, y, 0]);
		}
	}
</script>

<Line {points} {material} />
