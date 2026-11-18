import Basemap from '@arcgis/core/Basemap.js';
import esriConfig from '@arcgis/core/config.js';
import Point from '@arcgis/core/geometry/Point.js';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer.js';
import TileLayer from '@arcgis/core/layers/TileLayer.js';
import EsriMap from '@arcgis/core/Map.js';
import MapView from '@arcgis/core/views/MapView.js';
import '@arcgis/core/assets/esri/themes/light/main.css';
import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import { ISRAEL_CENTER, ISRAEL_ZOOM, KEYED_BASEMAP_ID, MAP_WKID, PUBLIC_BASEMAP_URL } from '../constants/appConstants';

/** The map view and the graphics layers the app draws on. */
export interface MapContext {
  view: MapView;
  layers: {
    /** Saved polygons. */
    polygons: GraphicsLayer;
    /** Saved and unsaved objects. */
    objects: GraphicsLayer;
    /** The closed polygon that is not saved yet. */
    draft: GraphicsLayer;
    /** The polygon being drawn, and the selection box. */
    sketch: GraphicsLayer;
  };
}

/**
 * The basemap: the id from VITE_ARCGIS_BASEMAP if set, else the vector basemap when an API key is set,
 * else Esri's public tiles, which need no key.
 */
function chooseBasemap(apiKey: string | undefined, basemapId: string | undefined): string | Basemap {
  if (basemapId) return basemapId;
  if (apiKey) return KEYED_BASEMAP_ID;
  return new Basemap({ baseLayers: [new TileLayer({ url: PUBLIC_BASEMAP_URL })] });
}

/**
 * Creates the 2D MapView in the container, zoomed to Israel, and destroys it when the component unmounts.
 * (React StrictMode mounts twice in development, so the cleanup matters.) Returns null until the view exists.
 * The view and its graphics are never put in Redux.
 */
export function useMapView(containerRef: RefObject<HTMLDivElement | null>): MapContext | null {
  const [context, setContext] = useState<MapContext | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const apiKey = import.meta.env.VITE_ARCGIS_API_KEY;
    if (apiKey) esriConfig.apiKey = apiKey;

    const layers = {
      polygons: new GraphicsLayer({ title: 'Polygons' }),
      draft: new GraphicsLayer({ title: 'Draft polygon' }),
      objects: new GraphicsLayer({ title: 'Objects' }),
      sketch: new GraphicsLayer({ title: 'Sketch', listMode: 'hide' }),
    };

    const map = new EsriMap({
      basemap: chooseBasemap(apiKey, import.meta.env.VITE_ARCGIS_BASEMAP),
      layers: [layers.polygons, layers.draft, layers.objects, layers.sketch],
    });

    const view = new MapView({
      container,
      map,
      center: new Point({ ...ISRAEL_CENTER, spatialReference: { wkid: MAP_WKID } }),
      zoom: ISRAEL_ZOOM,
      popupEnabled: false,
    });

    setContext({ view, layers });

    return () => {
      setContext(null);
      view.destroy();
    };
  }, [containerRef]);

  return context;
}
