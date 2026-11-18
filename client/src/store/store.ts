import { configureStore } from '@reduxjs/toolkit';
import { taskMapApi } from '../services/taskMapApi';
import mapDataReducer from './slices/mapDataSlice';
import notificationReducer from './slices/notificationSlice';
import objectsReducer from './slices/objectsSlice';
import polygonReducer from './slices/polygonSlice';

/** The app store: one slice per panel, plus the API cache. Map objects are never stored here, only ids and GeoJSON. */
export const store = configureStore({
  reducer: {
    polygon: polygonReducer,
    objects: objectsReducer,
    mapData: mapDataReducer,
    notification: notificationReducer,
    [taskMapApi.reducerPath]: taskMapApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(taskMapApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
