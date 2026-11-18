import { useEffect } from 'react';
import type { GeoJsonPolygon } from '../interfaces/geo';
import type { ObjectDto, PolygonDto } from '../interfaces/models';
import { objectGraphics, polygonGraphics } from '../services/mapGraphics';
import type { MapContext } from './useMapView';

interface MapItems {
  polygons: PolygonDto[];
  /** Saved objects. */
  objects: ObjectDto[];
  /** Objects placed on the map and not saved yet. */
  pending: ObjectDto[];
  /** The closed polygon that is not saved yet. */
  draft: GeoJsonPolygon | null;
  selectedIds: string[];
}

/** Redraws the map's graphics whenever the items or the selection change. State is the source of truth. */
export function useGraphicsSync(context: MapContext | null, items: MapItems) {
  const { polygons, objects, pending, draft, selectedIds } = items;

  useEffect(() => {
    if (!context) return;
    const { layers } = context;
    layers.polygons.removeAll();
    layers.polygons.addMany(
      polygons.flatMap((polygon) => polygonGraphics(polygon.id, polygon.geometry, selectedIds.includes(polygon.id))),
    );
  }, [context, polygons, selectedIds]);

  useEffect(() => {
    if (!context) return;
    const { layers } = context;
    layers.objects.removeAll();
    layers.objects.addMany(
      [...objects, ...pending].flatMap((object) => objectGraphics(object, selectedIds.includes(object.id))),
    );
  }, [context, objects, pending, selectedIds]);

  useEffect(() => {
    if (!context) return;
    const { layers } = context;
    layers.draft.removeAll();
    if (draft) layers.draft.addMany(polygonGraphics('draft', draft, false));
  }, [context, draft]);
}
