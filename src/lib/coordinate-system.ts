import type { Point } from './types';

export enum CoordinateSystem {
  Cartesian = 'cartesian',
  Polar = 'polar',
  Spherical = 'spherical',
  // Cylindrical = 'cylindrical'
}

/**
 * Converts a point in a given coordinate system to a point in the cartesian coordinate system.
 */
export function toCartesian(coordinateSystem: CoordinateSystem, point: Point): Point {
  switch (coordinateSystem) {
    case CoordinateSystem.Polar:
      return polarToCartesian(point[0], point[1]);
    case CoordinateSystem.Spherical:
      return sphericalToCartesian(point[0], point[1], point[2]);
  }
  return point;
}

function polarToCartesian(rho: number, phi: number): Point {
  const x = rho * Math.cos(phi);
  const y = rho * Math.sin(phi);
  return [x, y, 0];
}

function sphericalToCartesian(rho: number, phi: number, theta: number): Point {
  const x = rho * Math.cos(phi) * Math.sin(theta);
  const y = rho * Math.sin(phi) * Math.sin(theta);
  const z = rho * Math.cos(theta);
  return [x, y, z];
}
