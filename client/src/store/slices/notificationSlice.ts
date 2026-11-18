import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

/** The message shown in the error snackbar, or null when there is none. */
export interface NotificationState {
  message: string | null;
}

const initialState: NotificationState = { message: null };

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    notify(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
    dismiss(state) {
      state.message = null;
    },
  },
});

export const { notify, dismiss } = notificationSlice.actions;
export default notificationSlice.reducer;
