import type { Point } from './types';

export enum CoordinateSystem {
  Cartesian,
  // Polar,
  Spherical,
  // Cylindrical
}

export function sphericalToCartesian(rho: number, phi: number, theta: number): Point {
  const x = rho * Math.cos(phi) * Math.sin(theta);
  const y = rho * Math.sin(phi) * Math.sin(theta);
  const z = rho * Math.cos(theta);
  return [x, y, z];
}
