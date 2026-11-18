import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol.js';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol.js';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol.js';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol.js';
import jeepUrl from '../assets/symbols/jeep.svg';
import truckUrl from '../assets/symbols/truck.svg';
import { MapColors } from '../constants/mapColors';
import { SymbolKey } from '../enums/symbolKey';

/** The map symbols (see DESIGN.md, Map symbology). Each graphic gets its symbol directly, not through a renderer. */

/** Point: blue with a darker blue border and a small radius. Also the vertex of lines and polygons. */
export function pointSymbol(): SimpleMarkerSymbol {
  return new SimpleMarkerSymbol({
    style: 'circle',
    size: 8,
    color: MapColors.pointFill,
    outline: { color: MapColors.pointBorder, width: 1.5 },
  });
}

/** Line: very dark black. */
export function lineSymbol(): SimpleLineSymbol {
  return new SimpleLineSymbol({ color: MapColors.line, width: 2 });
}

/** Polygon: the line symbol as outline with a light fill. The fill is an open question for the client. */
export function polygonSymbol(selected: boolean): SimpleFillSymbol {
  return new SimpleFillSymbol({
    color: selected ? MapColors.polygonFillSelected : MapColors.polygonFill,
    outline: { color: selected ? MapColors.highlight : MapColors.line, width: selected ? 3 : 2 },
  });
}

/** The picture of each object symbol, bundled with the client. */
const SYMBOL_IMAGES: Record<SymbolKey, string> = {
  [SymbolKey.Jeep]: jeepUrl,
  [SymbolKey.Truck]: truckUrl,
};

/** The symbol of an object: its picture, anchored at the object's location. */
export function objectSymbol(symbolKey: SymbolKey): PictureMarkerSymbol {
  return new PictureMarkerSymbol({ url: SYMBOL_IMAGES[symbolKey], width: 32, height: 20 });
}

/** A ring drawn around a selected object. */
export function haloSymbol(): SimpleMarkerSymbol {
  return new SimpleMarkerSymbol({
    style: 'circle',
    size: 30,
    color: [0, 0, 0, 0],
    outline: { color: MapColors.highlight, width: 3 },
  });
}

/** The transparent bluish box shown while click-and-dragging a selection. */
export function selectionBoxSymbol(): SimpleFillSymbol {
  return new SimpleFillSymbol({
    color: MapColors.selectionBoxFill,
    outline: { color: MapColors.selectionBoxOutline, width: 1, style: 'dash' },
  });
}
