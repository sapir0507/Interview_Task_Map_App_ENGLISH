import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SIDE_PANEL_DEFAULT_WIDTH_PX, SIDE_PANEL_MIN_WIDTH_PX } from '../../constants/appConstants';
import { ResizeHandle } from './ResizeHandle';

describe('ResizeHandle', () => {
  it('widens the column when dragged to the left', () => {
    const onChange = vi.fn();
    render(<ResizeHandle width={400} onChange={onChange} />);
    const handle = screen.getByRole('separator');
    fireEvent.pointerDown(handle, { clientX: 700, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 600, pointerId: 1 });
    expect(onChange).toHaveBeenLastCalledWith(500);
  });

  it('does nothing on move before the pointer is pressed', () => {
    const onChange = vi.fn();
    render(<ResizeHandle width={400} onChange={onChange} />);
    fireEvent.pointerMove(screen.getByRole('separator'), { clientX: 600, pointerId: 1 });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('never goes below the minimum width', () => {
    const onChange = vi.fn();
    render(<ResizeHandle width={SIDE_PANEL_MIN_WIDTH_PX} onChange={onChange} />);
    const handle = screen.getByRole('separator');
    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenLastCalledWith(SIDE_PANEL_MIN_WIDTH_PX);
  });

  it('moves with the arrow keys and resets on double-click', () => {
    const onChange = vi.fn();
    render(<ResizeHandle width={400} onChange={onChange} />);
    const handle = screen.getByRole('separator');
    fireEvent.keyDown(handle, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenLastCalledWith(424);
    fireEvent.doubleClick(handle);
    expect(onChange).toHaveBeenLastCalledWith(SIDE_PANEL_DEFAULT_WIDTH_PX);
  });
});
