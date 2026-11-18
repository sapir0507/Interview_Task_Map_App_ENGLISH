import type { MapXY } from '../interfaces/geo';

/** Web Mercator, Esri's code (EPSG calls it 3857). Used everywhere on the client. */
export const MAP_WKID = 102100;

/** Initial view: all of Israel. */
export const ISRAEL_CENTER: MapXY = { x: 3896182.18, y: 3684806.44 };
export const ISRAEL_ZOOM = 8;

/**
 * Basemap without an API key: Esri's public World Street Map tiles (Web Mercator, so they match the view).
 * The vector basemap styles (streets-vector and the rest) answer 499 "Token Required" without a key.
 */
export const PUBLIC_BASEMAP_URL = 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer';

/** Basemap used when VITE_ARCGIS_API_KEY is set and VITE_ARCGIS_BASEMAP is not. */
export const KEYED_BASEMAP_ID = 'streets-vector';

/** A click this close (in screen pixels) to the first vertex closes the polygon. */
export const CLOSE_TOLERANCE_PX = 5;

/** A click this close (in screen pixels) to the previous vertex is ignored, so no duplicate vertices are made. */
export const DUPLICATE_VERTEX_TOLERANCE_PX = 2;

/** A polygon needs at least this many distinct vertices. */
export const MIN_POLYGON_VERTICES = 3;

/** Coordinates are rounded to this many decimals (about 10 cm). */
export const COORDINATE_DECIMALS = 6;

/** Delete clicks in a row with nothing selected before the hint shows. */
export const DELETE_HINT_CLICKS = 3;
export const DELETE_HINT_TEXT = 'select a polygon from the table below, or from the interactive map';
export const DELETE_TOOLTIP_TEXT = 'Deletes selected polygons';

/** Hover helper text of the other buttons. */
export const POLYGON_ADD_TOOLTIP_TEXT = 'Draws a new polygon on the map';
export const POLYGON_SAVE_TOOLTIP_TEXT = 'Saves the drawn polygon';
export const OBJECT_ADD_TOOLTIP_TEXT = 'Places a new object (jeep or truck) on the map';
export const OBJECT_SAVE_TOOLTIP_TEXT = 'Saves the placed objects';
export const OBJECT_DELETE_TOOLTIP_TEXT = 'Deletes selected objects';

/** The side column (Polygon, Objects, Map Data) starts this wide, in px. */
export const SIDE_PANEL_DEFAULT_WIDTH_PX = 400;

/** The side column can be dragged no narrower than this, in px. */
export const SIDE_PANEL_MIN_WIDTH_PX = 320;

/** The side column can be dragged no wider than this share of the window, so the map never disappears. */
export const SIDE_PANEL_MAX_WIDTH_RATIO = 0.7;

/** Arrow keys on the resize handle move the side column this many px at a time. */
export const SIDE_PANEL_KEY_STEP_PX = 24;
