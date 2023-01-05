import { compile } from 'mathjs';
import type { EvalFunction, MathScope } from './types';

export function compileMathExpression(expression: string): EvalFunction | undefined {
  try {
    return compile(expression).evaluate;
  } catch (_) {
    return;
  }
}

export function evaluateMathExpression(evalFunction: EvalFunction, scope: MathScope): number | undefined {
  try {
    return evalFunction(scope);
  } catch (_) {
    return;
  }
}

