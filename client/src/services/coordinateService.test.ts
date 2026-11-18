import { describe, expect, it } from 'vitest';
import { ISRAEL_CENTER } from '../constants/appConstants';
import {
  geoJsonToPoint,
  lonLatToWebMercator,
  pointToGeoJson,
  polygonCentroid,
  polygonToVertices,
  verticesToPolygon,
  webMercatorToLonLat,
} from './coordinateService';

describe('coordinateService', () => {
  it('converts the Israel map center to a point in Israel', () => {
    const { lon, lat } = webMercatorToLonLat(ISRAEL_CENTER);
    expect(lon).toBeCloseTo(35, 0);
    expect(lat).toBeGreaterThan(30);
    expect(lat).toBeLessThan(33);
  });

  it('round-trips Web Mercator and WGS84', () => {
    const original = { lon: 34.7818, lat: 32.0853 };
    const back = webMercatorToLonLat(lonLatToWebMercator(original));
    expect(back.lon).toBeCloseTo(original.lon, 9);
    expect(back.lat).toBeCloseTo(original.lat, 9);
  });

  it('stores a point as [lng, lat]', () => {
    const geometry = pointToGeoJson(lonLatToWebMercator({ lon: 34.78, lat: 32.08 }));
    expect(geometry).toEqual({ type: 'Point', coordinates: [34.78, 32.08] });
  });

  it('reads a stored point back to the same place', () => {
    const point = lonLatToWebMercator({ lon: 34.78, lat: 32.08 });
    const back = geoJsonToPoint(pointToGeoJson(point));
    expect(back.x).toBeCloseTo(point.x, 0);
    expect(back.y).toBeCloseTo(point.y, 0);
  });

  it('closes the ring with a copy of the exact first position', () => {
    const vertices = [
      lonLatToWebMercator({ lon: 34, lat: 31 }),
      lonLatToWebMercator({ lon: 35, lat: 31 }),
      lonLatToWebMercator({ lon: 35, lat: 32 }),
    ];
    const { coordinates } = verticesToPolygon(vertices);
    const ring = coordinates[0];
    expect(ring).toHaveLength(4);
    expect(ring[3]).toEqual(ring[0]);
    expect(ring[3]).not.toBe(ring[0]);
  });

  it('rejects fewer than 3 vertices', () => {
    expect(() =>
      verticesToPolygon([
        { x: 0, y: 0 },
        { x: 1, y: 1 },
      ]),
    ).toThrow();
  });

  it('gives back the same vertices without the closing one', () => {
    const vertices = [
      lonLatToWebMercator({ lon: 34, lat: 31 }),
      lonLatToWebMercator({ lon: 35, lat: 31 }),
      lonLatToWebMercator({ lon: 35, lat: 32 }),
    ];
    const back = polygonToVertices(verticesToPolygon(vertices));
    expect(back).toHaveLength(3);
    expect(back[1].x).toBeCloseTo(vertices[1].x, 0);
  });

  it('finds the centroid of a rectangle, whatever the ring direction', () => {
    const rectangle = (ring: [number, number][]) => ({ type: 'Polygon' as const, coordinates: [[...ring, ring[0]]] });
    const counterClockwise = rectangle([
      [0, 0],
      [4, 0],
      [4, 2],
      [0, 2],
    ]);
    const clockwise = rectangle([
      [0, 0],
      [0, 2],
      [4, 2],
      [4, 0],
    ]);
    expect(polygonCentroid(counterClockwise)).toEqual({ lon: 2, lat: 1 });
    expect(polygonCentroid(clockwise)).toEqual({ lon: 2, lat: 1 });
  });

  it('averages the vertices of a degenerate polygon', () => {
    const line = {
      type: 'Polygon' as const,
      coordinates: [
        [
          [0, 0],
          [2, 2],
          [4, 4],
          [0, 0],
        ] as [number, number][],
      ],
    };
    const { lon, lat } = polygonCentroid(line);
    expect(lon).toBeCloseTo(2, 5);
    expect(lat).toBeCloseTo(2, 5);
  });
});
