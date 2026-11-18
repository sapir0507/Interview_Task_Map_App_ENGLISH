import Graphic from '@arcgis/core/Graphic.js';
import Point from '@arcgis/core/geometry/Point.js';
import Polygon from '@arcgis/core/geometry/Polygon.js';
import Polyline from '@arcgis/core/geometry/Polyline.js';
import { MAP_WKID } from '../constants/appConstants';
import type { GeoJsonPolygon, MapBox, MapXY } from '../interfaces/geo';
import type { ObjectDto } from '../interfaces/models';
import { geoJsonToPoint, polygonToVertices } from './coordinateService';
import { haloSymbol, lineSymbol, objectSymbol, pointSymbol, polygonSymbol, selectionBoxSymbol } from './mapSymbols';

/**
 * Builders of the graphics shown on the map. Every graphic that belongs to a saved or unsaved item carries the
 * item's id in its attributes, so a click on any part of it (outline, vertex, halo) selects the whole item.
 */

const spatialReference = { wkid: MAP_WKID };

function point({ x, y }: MapXY): Point {
  return new Point({ x, y, spatialReference });
}

function ring(vertices: MapXY[]): number[][] {
  return [...vertices, vertices[0]].map(({ x, y }) => [x, y]);
}

/** A polygon: the closed shape plus a point at every vertex. */
export function polygonGraphics(id: string, geometry: GeoJsonPolygon, selected: boolean): Graphic[] {
  const vertices = polygonToVertices(geometry);
  const shape = new Graphic({
    geometry: new Polygon({ rings: [ring(vertices)], spatialReference }),
    symbol: polygonSymbol(selected),
    attributes: { id },
  });
  const vertexGraphics = vertices.map(
    (vertex) => new Graphic({ geometry: point(vertex), symbol: pointSymbol(), attributes: { id } }),
  );
  return [shape, ...vertexGraphics];
}

/** An object: its symbol, with a halo when selected. */
export function objectGraphics(object: ObjectDto, selected: boolean): Graphic[] {
  const location = point(geoJsonToPoint(object.geometry));
  const graphics = [
    new Graphic({ geometry: location, symbol: objectSymbol(object.symbolKey), attributes: { id: object.id } }),
  ];
  if (selected) {
    graphics.unshift(new Graphic({ geometry: location, symbol: haloSymbol(), attributes: { id: object.id } }));
  }
  return graphics;
}

/** A polygon being drawn: the line through the vertices so far to the cursor, with a point at every vertex. */
export function previewGraphics(vertices: MapXY[], cursor?: MapXY): Graphic[] {
  if (vertices.length === 0) return [];
  const path = [...vertices, ...(cursor ? [cursor] : [])].map(({ x, y }) => [x, y]);
  const line = new Graphic({ geometry: new Polyline({ paths: [path], spatialReference }), symbol: lineSymbol() });
  const points = vertices.map((vertex) => new Graphic({ geometry: point(vertex), symbol: pointSymbol() }));
  return [line, ...points];
}

/** The selection box. */
export function boxGraphic(box: MapBox): Graphic {
  const { xmin, ymin, xmax, ymax } = box;
  return new Graphic({
    geometry: new Polygon({
      rings: [
        [
          [xmin, ymin],
          [xmax, ymin],
          [xmax, ymax],
          [xmin, ymax],
          [xmin, ymin],
        ],
      ],
      spatialReference,
    }),
    symbol: selectionBoxSymbol(),
  });
}
