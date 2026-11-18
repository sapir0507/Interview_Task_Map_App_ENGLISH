import Point from '@arcgis/core/geometry/Point.js';
import { useEffect, useRef } from 'react';
import { CLOSE_TOLERANCE_PX, DUPLICATE_VERTEX_TOLERANCE_PX, MIN_POLYGON_VERTICES } from '../constants/appConstants';
import type { MapXY } from '../interfaces/geo';
import { pointToGeoJson, polygonToVertices, verticesToPolygon } from '../services/coordinateService';
import { boxFromCorners, boxIntersectsRing, isNearPoint } from '../services/geometryService';
import { boxGraphic, previewGraphics } from '../services/mapGraphics';
import { nextName, symbolLabel } from '../services/namingService';
import { taskMapApi } from '../services/taskMapApi';
import { clearSelection, setSelection, toggleSelection } from '../store/slices/mapDataSlice';
import { addPending, stopPlacing } from '../store/slices/objectsSlice';
import { drawingClosed, startDrawing } from '../store/slices/polygonSlice';
import { useAppDispatch, useAppSelector, useAppStore } from './storeHooks';
import type { MapContext } from './useMapView';

/**
 * Wires the mouse to the app, in one click handler that checks the mode:
 * - drawing a polygon: a click adds a vertex, a click on the first vertex (within a few pixels) closes it;
 * - placing an object: a click puts it on the map;
 * - otherwise: a click selects the item under it (Ctrl or Shift toggles), and Ctrl + drag selects every polygon
 *   the box touches.
 * The handlers read the latest state from the store, so they never go stale.
 */
export function useMapInteractions(context: MapContext | null) {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const isDrawing = useAppSelector((state) => state.polygon.isDrawing);
  const drawSession = useAppSelector((state) => state.polygon.drawSession);

  /** The map vertices of the polygon being drawn. */
  const vertices = useRef<MapXY[]>([]);
  /** The draw session a click already seeded a vertex for (see below). */
  const seededSession = useRef<number | null>(null);

  // A new drawing (Add) or a cancelled one starts from nothing. A click on the map after a polygon was closed
  // starts a new drawing with that click as its first vertex, and marks its session as seeded so it is kept.
  useEffect(() => {
    if (!context) return;
    if (isDrawing && seededSession.current === drawSession) return;
    vertices.current = [];
    context.layers.sketch.removeAll();
  }, [context, isDrawing, drawSession]);

  useEffect(() => {
    if (!context) return;
    const { view, layers } = context;
    let boxOrigin: MapXY | null = null;

    const showPreview = (cursor?: MapXY) => {
      layers.sketch.removeAll();
      layers.sketch.addMany(previewGraphics(vertices.current, cursor));
    };

    /** Adds a vertex, or closes the polygon when the click is on the first vertex. */
    const addVertex = (mapPoint: MapXY, screen: { x: number; y: number }) => {
      const [first] = vertices.current;
      const last = vertices.current[vertices.current.length - 1];
      /** Is the click within `tolerance` pixels of a map vertex? */
      const isClickNear = (vertex: MapXY, tolerance: number) => {
        const vertexScreen = view.toScreen(new Point({ ...vertex, spatialReference: view.spatialReference }));
        return !!vertexScreen && isNearPoint(vertexScreen, screen, tolerance);
      };
      if (first) {
        if (isClickNear(first, CLOSE_TOLERANCE_PX)) {
          // Too few vertices: ignore the click instead of adding a duplicate of the first one.
          if (vertices.current.length < MIN_POLYGON_VERTICES) return;
          const geometry = verticesToPolygon(vertices.current);
          vertices.current = [];
          layers.sketch.removeAll();
          store.dispatch(drawingClosed(geometry));
          return;
        }
        if (isClickNear(last, DUPLICATE_VERTEX_TOLERANCE_PX)) return;
      }
      vertices.current = [...vertices.current, mapPoint];
      showPreview(mapPoint);
    };

    // immediate-click, not click: `click` is not emitted for a quick second click (it becomes a double-click),
    // which would lose a vertex. Stopping propagation also keeps the map from zooming on a double-click.
    const clickHandle = view.on('immediate-click', async (event) => {
      const state = store.getState();
      const mapPoint: MapXY = { x: event.mapPoint.x, y: event.mapPoint.y };
      const screen = { x: event.x, y: event.y };

      if (state.polygon.isDrawing) {
        event.stopPropagation();
        addVertex(mapPoint, screen);
        return;
      }

      if (state.objects.placing) {
        event.stopPropagation();
        const symbolKey = state.objects.placing;
        const saved = taskMapApi.endpoints.getObjects.select()(state).data ?? [];
        const names = [...saved, ...state.objects.pending].map((object) => object.name);
        dispatch(
          addPending({
            id: crypto.randomUUID(),
            name: nextName(symbolLabel(symbolKey), names),
            symbolKey,
            geometry: pointToGeoJson(mapPoint),
          }),
        );
        dispatch(stopPlacing());
        return;
      }

      const hits = await view.hitTest(event, { include: [layers.objects, layers.polygons] });
      const hit = hits.results.find((result) => result.type === 'graphic' && result.graphic.attributes?.id);
      const id = hit && hit.type === 'graphic' ? (hit.graphic.attributes.id as string) : null;

      if (id) {
        const additive = event.native.ctrlKey || event.native.shiftKey;
        dispatch(additive ? toggleSelection(id) : setSelection([id]));
        return;
      }

      if (store.getState().polygon.draft) {
        // A click on empty map after a polygon was closed erases it and starts a new one here.
        dispatch(startDrawing());
        seededSession.current = store.getState().polygon.drawSession;
        vertices.current = [];
        addVertex(mapPoint, screen);
        return;
      }
      dispatch(clearSelection());
    });

    const moveHandle = view.on('pointer-move', (event) => {
      if (!store.getState().polygon.isDrawing || vertices.current.length === 0) return;
      const cursor = view.toMap({ x: event.x, y: event.y });
      if (cursor) showPreview({ x: cursor.x, y: cursor.y });
    });

    // Closing a polygon with a double-click must not also zoom the map.
    const doubleClickHandle = view.on('double-click', (event) => {
      if (store.getState().polygon.isDrawing) event.stopPropagation();
    });

    // Ctrl + drag draws the selection box. A plain drag still pans the map.
    const dragHandle = view.on('drag', (event) => {
      if (event.action === 'start') {
        if (!event.native.ctrlKey || store.getState().polygon.isDrawing) return;
        const origin = view.toMap({ x: event.origin.x, y: event.origin.y });
        if (!origin) return;
        boxOrigin = { x: origin.x, y: origin.y };
      }
      if (!boxOrigin) return;
      event.stopPropagation();

      const corner = view.toMap({ x: event.x, y: event.y });
      if (!corner) return;
      const box = boxFromCorners(boxOrigin, { x: corner.x, y: corner.y });

      if (event.action === 'end') {
        boxOrigin = null;
        layers.sketch.removeAll();
        const saved = taskMapApi.endpoints.getPolygons.select()(store.getState()).data ?? [];
        const ids = saved
          .filter((polygon) => boxIntersectsRing(box, polygonToVertices(polygon.geometry)))
          .map((polygon) => polygon.id);
        dispatch(setSelection(ids));
        return;
      }
      layers.sketch.removeAll();
      layers.sketch.add(boxGraphic(box));
    });

    return () => {
      clickHandle.remove();
      moveHandle.remove();
      doubleClickHandle.remove();
      dragHandle.remove();
    };
  }, [context, dispatch, store]);
}
