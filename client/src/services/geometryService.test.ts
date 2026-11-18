import { describe, expect, it } from 'vitest';
import { boxFromCorners, boxIntersectsRing, isNearPoint } from './geometryService';

const square = [
  { x: 0, y: 0 },
  { x: 10, y: 0 },
  { x: 10, y: 10 },
  { x: 0, y: 10 },
];

describe('isNearPoint', () => {
  it('counts a click within the tolerance as clicking the point', () => {
    expect(isNearPoint({ x: 100, y: 100 }, { x: 103, y: 104 })).toBe(true);
  });

  it('does not count a click outside the tolerance', () => {
    expect(isNearPoint({ x: 100, y: 100 }, { x: 106, y: 100 })).toBe(false);
  });

  it('accepts a custom tolerance', () => {
    expect(isNearPoint({ x: 0, y: 0 }, { x: 8, y: 0 }, 10)).toBe(true);
  });
});

describe('boxFromCorners', () => {
  it('orders the corners whatever the drag direction', () => {
    expect(boxFromCorners({ x: 5, y: 9 }, { x: 1, y: 2 })).toEqual({ xmin: 1, ymin: 2, xmax: 5, ymax: 9 });
  });
});

describe('boxIntersectsRing', () => {
  it('is true when the box holds a vertex', () => {
    expect(boxIntersectsRing({ xmin: -1, ymin: -1, xmax: 1, ymax: 1 }, square)).toBe(true);
  });

  it('is true when the box is completely inside the polygon', () => {
    expect(boxIntersectsRing({ xmin: 4, ymin: 4, xmax: 6, ymax: 6 }, square)).toBe(true);
  });

  it('is true when the box holds the whole polygon', () => {
    expect(boxIntersectsRing({ xmin: -5, ymin: -5, xmax: 15, ymax: 15 }, square)).toBe(true);
  });

  it('is true when only edges cross', () => {
    // A thin box across the middle: no vertex inside either shape.
    expect(boxIntersectsRing({ xmin: -5, ymin: 4, xmax: 15, ymax: 6 }, square)).toBe(true);
  });

  it('is false when the box is apart from the polygon', () => {
    expect(boxIntersectsRing({ xmin: 20, ymin: 20, xmax: 30, ymax: 30 }, square)).toBe(false);
  });
});
