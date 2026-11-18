import { describe, expect, it } from 'vitest';
import { MapItemType } from '../enums/mapItemType';
import { SymbolKey } from '../enums/symbolKey';
import type { ObjectDto, PolygonDto } from '../interfaces/models';
import { buildMapDataRows } from './mapDataService';

const polygon: PolygonDto = {
  id: 'p1',
  name: 'Polygon 1',
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [34, 31],
        [36, 31],
        [36, 33],
        [34, 33],
        [34, 31],
      ],
    ],
  },
};

const object: ObjectDto = {
  id: 'o1',
  name: 'Jeep 1',
  symbolKey: SymbolKey.Jeep,
  geometry: { type: 'Point', coordinates: [34.78, 32.08] },
};

describe('buildMapDataRows', () => {
  it('lists polygons first, then objects, one row each', () => {
    const rows = buildMapDataRows([polygon], [object]);
    expect(rows.map((r) => r.id)).toEqual(['p1', 'o1']);
    expect(rows.map((r) => r.type)).toEqual([MapItemType.Polygon, MapItemType.Object]);
  });

  it('shows the centroid of a polygon and the position of an object as lat / lon', () => {
    const [polygonRow, objectRow] = buildMapDataRows([polygon], [object]);
    expect(polygonRow.lon).toBeCloseTo(35, 5);
    expect(polygonRow.lat).toBeCloseTo(32, 5);
    expect(objectRow.lon).toBe(34.78);
    expect(objectRow.lat).toBe(32.08);
  });

  it('gives each row a name, a type and object: { geometry }', () => {
    const [polygonRow, objectRow] = buildMapDataRows([polygon], [object]);
    expect(polygonRow).toMatchObject({
      name: 'Polygon 1',
      type: MapItemType.Polygon,
      object: { geometry: polygon.geometry },
    });
    expect(objectRow).toMatchObject({
      name: 'Jeep 1',
      type: MapItemType.Object,
      object: { geometry: object.geometry },
    });
  });

  it('is empty when nothing is saved', () => {
    expect(buildMapDataRows([], [])).toEqual([]);
  });
});
