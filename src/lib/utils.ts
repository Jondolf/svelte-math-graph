import { compile } from 'mathjs';
import type { EvalFunction, MathScope, Variables } from './types';

export function getConfiguredVars(defaultVars: Variables, userVars: Variables): Variables {
  const vars = defaultVars;
  for (const [varName, varProperties] of Object.entries(userVars)) {
    vars[varName] = varProperties;
  }
  return vars;
}

export function parseFunctionString(functionString: string): [string[], string] {
  const [functionNotation, functionExpression] = functionString.split('=');
  const vars = functionNotation.match(/\((?<vars>[A-Za-z, ]*)\)/)?.groups?.vars ?? '';
  const varArr = vars.replaceAll(' ', '').split(',');
  return [varArr.filter((str) => str !== '').sort(), functionExpression];
}

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

export function mathScopeFromVariables(variables: Variables): MathScope {
  const scope: MathScope = {};

  for (const [key, { value }] of Object.entries(variables)) {
    scope[key] = value || 0;
  }

  return scope;
}

export function HSLToHex(h: number, s: number, l: number): string {
  const hDecimal = l / 100;
  const a = (s * Math.min(hDecimal, 1 - hDecimal)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = hDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);

    // Convert to Hex and prefix with "0" if required
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

