import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, expect, it, vi } from 'vitest';
import { DELETE_HINT_TEXT } from '../../constants/appConstants';
import mapDataReducer, { setSelection } from '../../store/slices/mapDataSlice';
import notificationReducer from '../../store/slices/notificationSlice';
import objectsReducer from '../../store/slices/objectsSlice';
import polygonReducer from '../../store/slices/polygonSlice';
import { PolygonPanel } from './PolygonPanel';

// The panel reads saved polygons and calls the server through these hooks. Nothing is saved here.
const deletePolygons = vi.fn();
vi.mock('../../services/taskMapApi', () => ({
  useGetPolygonsQuery: () => ({
    data: [{ id: 'p1', name: 'Polygon 1', geometry: { type: 'Polygon', coordinates: [] } }],
  }),
  useGetObjectsQuery: () => ({ data: [] }),
  useCreatePolygonMutation: () => [vi.fn(), { isLoading: false }],
  useDeletePolygonsMutation: () => [deletePolygons, { isLoading: false }],
}));
vi.mock('../../services/mapDataService', () => ({ buildMapDataRows: () => [] }));

function renderPanel() {
  const store = configureStore({
    reducer: {
      polygon: polygonReducer,
      objects: objectsReducer,
      mapData: mapDataReducer,
      notification: notificationReducer,
    },
  });
  render(
    <Provider store={store}>
      <PolygonPanel />
    </Provider>,
  );
  return store;
}

describe('PolygonPanel Delete', () => {
  it('is disabled and does nothing when no polygon is selected', () => {
    renderPanel();
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toBeDisabled();
    fireEvent.click(button.parentElement!);
    expect(deletePolygons).not.toHaveBeenCalled();
  });

  it('is enabled once a polygon is selected', () => {
    const store = renderPanel();
    act(() => {
      store.dispatch(setSelection(['p1']));
    });
    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled();
  });

  it('shows the red hint only after 3 clicks in a row with nothing selected', () => {
    renderPanel();
    // A disabled button ignores clicks, so they land on its wrapper, as in the browser.
    const button = screen.getByRole('button', { name: 'Delete' }).parentElement!;

    fireEvent.click(button);
    fireEvent.click(button);
    expect(screen.queryByText(DELETE_HINT_TEXT)).not.toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByText(DELETE_HINT_TEXT)).toBeInTheDocument();
  });

  it('hides the hint again once something is selected', () => {
    const store = renderPanel();
    const button = screen.getByRole('button', { name: 'Delete' }).parentElement!;
    for (let i = 0; i < 3; i++) fireEvent.click(button);
    expect(screen.getByText(DELETE_HINT_TEXT)).toBeInTheDocument();

    act(() => {
      store.dispatch(setSelection(['p1']));
    });
    expect(screen.queryByText(DELETE_HINT_TEXT)).not.toBeInTheDocument();
  });

  it('deletes the selected polygons', () => {
    deletePolygons.mockReturnValue({ unwrap: () => Promise.resolve([]) });
    const store = renderPanel();
    act(() => {
      store.dispatch(setSelection(['p1']));
    });
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(deletePolygons).toHaveBeenCalledWith(['p1']);
  });

  it('keeps Save off until a polygon is drawn', () => {
    renderPanel();
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });
});
