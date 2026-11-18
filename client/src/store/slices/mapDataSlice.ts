import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

/**
 * State of the Map Data panel. Selection is one set of ids shared by the map and the table, so selecting on the
 * map highlights the table row and the other way round. Polygon ids and object ids never collide.
 */
export interface MapDataState {
  selectedIds: string[];
}

const initialState: MapDataState = { selectedIds: [] };

const mapDataSlice = createSlice({
  name: 'mapData',
  initialState,
  reducers: {
    setSelection(state, action: PayloadAction<string[]>) {
      state.selectedIds = action.payload;
    },
    toggleSelection(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.selectedIds = state.selectedIds.includes(id)
        ? state.selectedIds.filter((selected) => selected !== id)
        : [...state.selectedIds, id];
    },
    clearSelection(state) {
      state.selectedIds = [];
    },
  },
});

export const { setSelection, toggleSelection, clearSelection } = mapDataSlice.actions;
export default mapDataSlice.reducer;
