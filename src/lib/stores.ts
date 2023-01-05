import { writable } from 'svelte/store';
import * as THREE from 'three';

export const graphScene = writable<THREE.Scene>(new THREE.Scene());
export const graphRenderer = writable<THREE.WebGLRenderer>();
export const graphCanvas = writable<HTMLCanvasElement>();
export const graphWidth = writable(0);
export const graphHeight = writable(0);
