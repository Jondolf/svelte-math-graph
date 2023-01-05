export type Point = [number, number, number];
export type Color = THREE.ColorRepresentation;

export type EvalFunction = (scope: MathScope) => number | undefined;
export type MathScope = { [variable: string]: number; };
