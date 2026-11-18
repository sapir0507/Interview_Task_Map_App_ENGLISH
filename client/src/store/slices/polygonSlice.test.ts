import { describe, expect, it } from 'vitest';
import reducer, { cancelDrawing, clearDraft, drawingClosed, emptyDeleteClick, startDrawing } from './polygonSlice';
import { clearSelection, setSelection, toggleSelection } from './mapDataSlice';

const polygon = {
  type: 'Polygon' as const,
  coordinates: [
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 0],
    ] as [number, number][],
  ],
};
const initial = reducer(undefined, { type: 'init' });

describe('polygonSlice', () => {
  it('starts drawing with nothing drawn and a new session', () => {
    const state = reducer({ ...initial, draft: polygon }, startDrawing());
    expect(state.isDrawing).toBe(true);
    expect(state.draft).toBeNull();
    expect(state.drawSession).toBe(initial.drawSession + 1);
  });

  it('ends drawing when the polygon is closed and keeps it as the draft', () => {
    const state = reducer(reducer(initial, startDrawing()), drawingClosed(polygon));
    expect(state.isDrawing).toBe(false);
    expect(state.draft).toEqual(polygon);
  });

  it('cancels drawing without touching the draft', () => {
    const state = reducer({ ...initial, isDrawing: true, draft: polygon }, cancelDrawing());
    expect(state.isDrawing).toBe(false);
    expect(state.draft).toEqual(polygon);
  });

  it('clears the draft', () => {
    expect(reducer({ ...initial, draft: polygon }, clearDraft()).draft).toBeNull();
  });

  it('counts Delete clicks in a row with nothing selected', () => {
    let state = initial;
    for (let i = 0; i < 3; i++) state = reducer(state, emptyDeleteClick());
    expect(state.emptyDeleteClicks).toBe(3);
  });

  it.each([
    ['setSelection', setSelection(['a'])],
    ['toggleSelection', toggleSelection('a')],
    ['clearSelection', clearSelection()],
  ])('resets the Delete click count on %s', (_name, action) => {
    const state = reducer({ ...initial, emptyDeleteClicks: 2 }, action);
    expect(state.emptyDeleteClicks).toBe(0);
  });

  it('resets the Delete click count when drawing starts', () => {
    expect(reducer({ ...initial, emptyDeleteClicks: 2 }, startDrawing()).emptyDeleteClicks).toBe(0);
  });
});
