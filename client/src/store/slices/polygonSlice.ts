import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { GeoJsonPolygon } from '../../interfaces/geo';
import { clearSelection, setSelection, toggleSelection } from './mapDataSlice';

/**
 * State of the Polygon panel.
 * The vertices of a polygon still being drawn live in the map hook (they are map coordinates), not here.
 * Only the finished, unsaved polygon (the draft) is kept here, as GeoJSON.
 */
export interface PolygonState {
  isDrawing: boolean;
  /** Bumped by every startDrawing, so the map hook can tell a fresh drawing from the same one. */
  drawSession: number;
  /** The closed polygon that is not saved yet. */
  draft: GeoJsonPolygon | null;
  /** Delete clicks in a row with nothing selected. */
  emptyDeleteClicks: number;
}

const initialState: PolygonState = {
  isDrawing: false,
  drawSession: 0,
  draft: null,
  emptyDeleteClicks: 0,
};

const polygonSlice = createSlice({
  name: 'polygon',
  initialState,
  reducers: {
    /** Add: enter drawing mode. Erases the unsaved polygon. */
    startDrawing(state) {
      state.isDrawing = true;
      state.drawSession += 1;
      state.draft = null;
      state.emptyDeleteClicks = 0;
    },
    /** Leave drawing mode without a polygon (for example when Objects Add is pressed). */
    cancelDrawing(state) {
      state.isDrawing = false;
    },
    /** The polygon was closed: drawing mode ends and the polygon waits for Save. */
    drawingClosed(state, action: PayloadAction<GeoJsonPolygon>) {
      state.isDrawing = false;
      state.draft = action.payload;
    },
    /** The unsaved polygon is gone (saved, or erased). */
    clearDraft(state) {
      state.draft = null;
    },
    /** Delete was clicked with nothing selected. */
    emptyDeleteClick(state) {
      state.emptyDeleteClicks += 1;
    },
  },
  extraReducers: (builder) => {
    // Any change of selection ends the run of empty Delete clicks.
    builder.addMatcher(isAnyOf(setSelection, toggleSelection, clearSelection), (state) => {
      state.emptyDeleteClicks = 0;
    });
  },
});

export const { startDrawing, cancelDrawing, drawingClosed, clearDraft, emptyDeleteClick } = polygonSlice.actions;
export default polygonSlice.reducer;
