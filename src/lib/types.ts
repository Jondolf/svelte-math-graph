import type { DefinedRanges } from './math-variables';

export type Point = [number, number, number];
export type Color = THREE.ColorRepresentation;

export type EvalFunction = (scope: MathScope) => number | undefined;
export type MathScope = { [variable: string]: number; };

export type Variables = { [variable: string]: Variable; };
export type Variable = {
  value?: number;
  ranges?: DefinedRanges;
};
