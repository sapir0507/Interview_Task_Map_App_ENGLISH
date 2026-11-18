import { COORDINATE_DECIMALS, MIN_POLYGON_VERTICES } from '../constants/appConstants';
import type { GeoJsonPoint, GeoJsonPolygon, LonLat, MapXY, Position } from '../interfaces/geo';

/** Radius of the sphere Web Mercator uses, in metres. */
const EARTH_RADIUS = 6378137;
const RAD_TO_DEG = 180 / Math.PI;
const DEG_TO_RAD = Math.PI / 180;

/**
 * The one place that converts between map coordinates (Web Mercator, x/y metres) and stored coordinates
 * (WGS84, GeoJSON [lng, lat]). Nothing else swaps axes or projects.
 */

/** Web Mercator metres to WGS84 degrees. */
export function webMercatorToLonLat({ x, y }: MapXY): LonLat {
  const lon = (x / EARTH_RADIUS) * RAD_TO_DEG;
  const lat = (Math.PI / 2 - 2 * Math.atan(Math.exp(-y / EARTH_RADIUS))) * RAD_TO_DEG;
  return { lon, lat };
}

/** WGS84 degrees to Web Mercator metres. */
export function lonLatToWebMercator({ lon, lat }: LonLat): MapXY {
  const x = EARTH_RADIUS * lon * DEG_TO_RAD;
  const y = EARTH_RADIUS * Math.log(Math.tan(Math.PI / 4 + (lat * DEG_TO_RAD) / 2));
  return { x, y };
}

function round(value: number): number {
  const factor = 10 ** COORDINATE_DECIMALS;
  return Math.round(value * factor) / factor;
}

function toPosition(xy: MapXY): Position {
  const { lon, lat } = webMercatorToLonLat(xy);
  return [round(lon), round(lat)];
}

function toXY([lon, lat]: Position): MapXY {
  return lonLatToWebMercator({ lon, lat });
}

/** A map point to a GeoJSON Point. */
export function pointToGeoJson(point: MapXY): GeoJsonPoint {
  return { type: 'Point', coordinates: toPosition(point) };
}

/** A GeoJSON Point to a map point. */
export function geoJsonToPoint(geometry: GeoJsonPoint): MapXY {
  return toXY(geometry.coordinates);
}

/**
 * The vertices a user clicked (no closing vertex) to a GeoJSON Polygon. The ring is closed with a copy of the
 * exact first position, as GeoJSON and MongoDB require.
 */
export function verticesToPolygon(vertices: MapXY[]): GeoJsonPolygon {
  if (vertices.length < MIN_POLYGON_VERTICES) {
    throw new Error(`A polygon needs at least ${MIN_POLYGON_VERTICES} vertices.`);
  }
  const ring = vertices.map(toPosition);
  ring.push([...ring[0]] as Position);
  return { type: 'Polygon', coordinates: [ring] };
}

/** The outer ring of a GeoJSON Polygon as map vertices, without the closing vertex. */
export function polygonToVertices(geometry: GeoJsonPolygon): MapXY[] {
  return geometry.coordinates[0].slice(0, -1).map(toXY);
}

/**
 * The centroid of the outer ring, in WGS84. Falls back to the average of the vertices for a degenerate ring.
 * (The centroid of a concave polygon can lie outside it. This is an open question for the client.)
 */
export function polygonCentroid(geometry: GeoJsonPolygon): LonLat {
  const ring = geometry.coordinates[0].slice(0, -1);
  let area = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < ring.length; i++) {
    const [x0, y0] = ring[i];
    const [x1, y1] = ring[(i + 1) % ring.length];
    const cross = x0 * y1 - x1 * y0;
    area += cross;
    cx += (x0 + x1) * cross;
    cy += (y0 + y1) * cross;
  }
  area /= 2;
  if (Math.abs(area) < 1e-12) {
    const lon = ring.reduce((sum, [x]) => sum + x, 0) / ring.length;
    const lat = ring.reduce((sum, [, y]) => sum + y, 0) / ring.length;
    return { lon, lat };
  }
  return { lon: cx / (6 * area), lat: cy / (6 * area) };
}
