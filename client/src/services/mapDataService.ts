import { MapItemType } from '../enums/mapItemType';
import type { MapDataRow } from '../interfaces/mapData';
import type { ObjectDto, PolygonDto } from '../interfaces/models';
import { polygonCentroid } from './coordinateService';

/** The Map Data table rows: every saved polygon (its centroid) followed by every saved object. */
export function buildMapDataRows(polygons: PolygonDto[], objects: ObjectDto[]): MapDataRow[] {
  const polygonRows = polygons.map<MapDataRow>((polygon) => {
    const { lon, lat } = polygonCentroid(polygon.geometry);
    return {
      id: polygon.id,
      name: polygon.name,
      type: MapItemType.Polygon,
      object: { geometry: polygon.geometry },
      lat,
      lon,
    };
  });
  const objectRows = objects.map<MapDataRow>((object) => {
    const [lon, lat] = object.geometry.coordinates;
    return {
      id: object.id,
      name: object.name,
      type: MapItemType.Object,
      object: { geometry: object.geometry },
      lat,
      lon,
    };
  });
  return [...polygonRows, ...objectRows];
}
