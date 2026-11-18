import type { MapItemType } from '../enums/mapItemType';
import type { GeoJsonPoint, GeoJsonPolygon } from './geo';

/** The `object` of a Map Data row: the item's GeoJSON geometry. */
export interface MapDataObject {
  geometry: GeoJsonPolygon | GeoJsonPoint;
}

/** One row of the Map Data table: `name`, `type` and `object: { geometry }`, plus the Lat / Lon shown beside them. */
export interface MapDataRow {
  id: string;
  name: string;
  type: MapItemType;
  object: MapDataObject;
  lat: number;
  lon: number;
}
