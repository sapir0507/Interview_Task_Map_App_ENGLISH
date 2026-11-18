/** A GeoJSON position: [longitude, latitude] in WGS84. */
export type Position = [number, number];

/** GeoJSON Point geometry (WGS84). */
export interface GeoJsonPoint {
  type: 'Point';
  coordinates: Position;
}

/** GeoJSON Polygon geometry (WGS84). The first ring is the outer ring and is closed. */
export interface GeoJsonPolygon {
  type: 'Polygon';
  coordinates: Position[][];
}

/** A WGS84 coordinate with named axes, so lat/lon order cannot be mixed up. */
export interface LonLat {
  lon: number;
  lat: number;
}

/** A map coordinate in Web Mercator (WKID 102100), in metres. */
export interface MapXY {
  x: number;
  y: number;
}

/** A position on the screen in pixels. */
export interface ScreenPoint {
  x: number;
  y: number;
}

/** An axis-aligned box in Web Mercator. */
export interface MapBox {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
}
