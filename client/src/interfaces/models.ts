import type { SymbolKey } from '../enums/symbolKey';
import type { GeoJsonPoint, GeoJsonPolygon } from './geo';

/** A polygon as the server returns it. */
export interface PolygonDto {
  id: string;
  name: string;
  geometry: GeoJsonPolygon;
}

/** A polygon to create. */
export type NewPolygon = Omit<PolygonDto, 'id'>;

/** An object (an image symbol such as a jeep or a truck) as the server returns it. Unsaved objects use a client-made id. */
export interface ObjectDto {
  id: string;
  name: string;
  symbolKey: SymbolKey;
  geometry: GeoJsonPoint;
}

/** An object to save. */
export type NewObject = Omit<ObjectDto, 'id'>;
