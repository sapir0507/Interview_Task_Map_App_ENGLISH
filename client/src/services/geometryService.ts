import { CLOSE_TOLERANCE_PX } from '../constants/appConstants';
import type { MapBox, MapXY, ScreenPoint } from '../interfaces/geo';

/** True when a click is close enough to a point (in screen pixels) to count as clicking it. */
export function isNearPoint(
  target: ScreenPoint,
  click: ScreenPoint,
  tolerancePx: number = CLOSE_TOLERANCE_PX,
): boolean {
  return Math.hypot(target.x - click.x, target.y - click.y) <= tolerancePx;
}

/** The box spanned by two opposite corners, whatever the drag direction. */
export function boxFromCorners(a: MapXY, b: MapXY): MapBox {
  return {
    xmin: Math.min(a.x, b.x),
    ymin: Math.min(a.y, b.y),
    xmax: Math.max(a.x, b.x),
    ymax: Math.max(a.y, b.y),
  };
}

function pointInBox(p: MapXY, box: MapBox): boolean {
  return p.x >= box.xmin && p.x <= box.xmax && p.y >= box.ymin && p.y <= box.ymax;
}

/** Ray casting: is the point inside the ring? */
function pointInRing(p: MapXY, ring: MapXY[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i];
    const b = ring[j];
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) {
      inside = !inside;
    }
  }
  return inside;
}

function orientation(a: MapXY, b: MapXY, c: MapXY): number {
  return Math.sign((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x));
}

function onSegment(a: MapXY, b: MapXY, p: MapXY): boolean {
  return (
    p.x >= Math.min(a.x, b.x) && p.x <= Math.max(a.x, b.x) && p.y >= Math.min(a.y, b.y) && p.y <= Math.max(a.y, b.y)
  );
}

function segmentsIntersect(a: MapXY, b: MapXY, c: MapXY, d: MapXY): boolean {
  const o1 = orientation(a, b, c);
  const o2 = orientation(a, b, d);
  const o3 = orientation(c, d, a);
  const o4 = orientation(c, d, b);
  if (o1 !== o2 && o3 !== o4) return true;
  if (o1 === 0 && onSegment(a, b, c)) return true;
  if (o2 === 0 && onSegment(a, b, d)) return true;
  if (o3 === 0 && onSegment(c, d, a)) return true;
  return o4 === 0 && onSegment(c, d, b);
}

/** True when a box and a polygon (outer ring, no closing vertex) overlap in any way. */
export function boxIntersectsRing(box: MapBox, ring: MapXY[]): boolean {
  // A vertex inside the box.
  if (ring.some((v) => pointInBox(v, box))) return true;

  const corners: MapXY[] = [
    { x: box.xmin, y: box.ymin },
    { x: box.xmax, y: box.ymin },
    { x: box.xmax, y: box.ymax },
    { x: box.xmin, y: box.ymax },
  ];
  // The box lies completely inside the polygon.
  if (pointInRing(corners[0], ring)) return true;

  // An edge of the polygon crosses an edge of the box.
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i];
    const b = ring[(i + 1) % ring.length];
    for (let k = 0; k < 4; k++) {
      if (segmentsIntersect(a, b, corners[k], corners[(k + 1) % 4])) return true;
    }
  }
  return false;
}
