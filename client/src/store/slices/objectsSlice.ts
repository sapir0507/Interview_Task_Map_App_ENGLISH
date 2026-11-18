import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { SymbolKey } from '../../enums/symbolKey';
import type { ObjectDto } from '../../interfaces/models';

/** State of the Objects panel. */
export interface ObjectsState {
  /** The symbol the next map click will place, or null when not placing. */
  placing: SymbolKey | null;
  /** Objects placed on the map and not saved yet. They have a client-made id until Save. */
  pending: ObjectDto[];
}

const initialState: ObjectsState = { placing: null, pending: [] };

const objectsSlice = createSlice({
  name: 'objects',
  initialState,
  reducers: {
    /** Add: the next map click places this symbol. */
    startPlacing(state, action: PayloadAction<SymbolKey>) {
      state.placing = action.payload;
    },
    stopPlacing(state) {
      state.placing = null;
    },
    addPending(state, action: PayloadAction<ObjectDto>) {
      state.pending.push(action.payload);
    },
    removePending(state, action: PayloadAction<string[]>) {
      state.pending = state.pending.filter((object) => !action.payload.includes(object.id));
    },
    clearPending(state) {
      state.pending = [];
    },
  },
});

export const { startPlacing, stopPlacing, addPending, removePending, clearPending } = objectsSlice.actions;
export default objectsSlice.reducer;
