import Graph from './Graph.svelte';

import PerspectiveCamera from './cameras/PerspectiveCamera.svelte';
import OrbitCamera from './cameras/OrbitCamera.svelte';

import AmbientLight from './lights/AmbientLight.svelte';
import DirectionalLight from './lights/DirectionalLight.svelte';

import Mesh from './meshes/Mesh.svelte';
import Line from './meshes/Line.svelte';

import CoordinateAxes from './meshes/CoordinateAxes.svelte';
import Curve from './meshes/Curve.svelte';
import Surface from './meshes/Surface.svelte';

import { CoordinateSystem } from './coordinate-system';
import ColorPicker from './ColorPicker.svelte';
import type { Color, Point } from './types';

export {
	// Core components
	Graph,

	// Cameras
	PerspectiveCamera,
	OrbitCamera,

	// Lights
	AmbientLight,
	DirectionalLight,

	// Meshes
	Mesh,
	Line,

	// Math meshes
	CoordinateAxes,
	Curve,
	Surface,

	// Miscallaneous
	CoordinateSystem,
	Point,
	Color,
	ColorPicker,
};
