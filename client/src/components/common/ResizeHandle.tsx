import Box from '@mui/material/Box';
import { useRef } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import {
  SIDE_PANEL_DEFAULT_WIDTH_PX,
  SIDE_PANEL_KEY_STEP_PX,
  SIDE_PANEL_MAX_WIDTH_RATIO,
  SIDE_PANEL_MIN_WIDTH_PX,
} from '../../constants/appConstants';

interface ResizeHandleProps {
  /** The current width of the column on the right of the handle, in px. */
  width: number;
  /** Called with the new width while the handle is dragged or moved with the keyboard. */
  onChange: (width: number) => void;
}

/** Keeps a width between the minimum and the share of the window the map can spare. */
function clampWidth(width: number): number {
  const max = Math.max(SIDE_PANEL_MIN_WIDTH_PX, window.innerWidth * SIDE_PANEL_MAX_WIDTH_RATIO);
  return Math.round(Math.min(max, Math.max(SIDE_PANEL_MIN_WIDTH_PX, width)));
}

/**
 * A vertical bar between the map and the side column. Drag it to the left to widen the column, or focus it and use
 * the arrow keys. Double-click puts the column back to its starting width.
 */
export function ResizeHandle({ width, onChange }: ResizeHandleProps) {
  const drag = useRef<{ startX: number; startWidth: number } | null>(null);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = { startX: event.clientX, startWidth: width };
    // Keep receiving the pointer while it is over the map, which would otherwise take the events.
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    onChange(clampWidth(drag.current.startWidth + (drag.current.startX - event.clientX)));
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') onChange(clampWidth(width + SIDE_PANEL_KEY_STEP_PX));
    else if (event.key === 'ArrowRight') onChange(clampWidth(width - SIDE_PANEL_KEY_STEP_PX));
    else return;
    event.preventDefault();
  };

  return (
    <Box
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize the side panels"
      aria-valuenow={width}
      aria-valuemin={SIDE_PANEL_MIN_WIDTH_PX}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      onDoubleClick={() => onChange(SIDE_PANEL_DEFAULT_WIDTH_PX)}
      sx={{
        cursor: 'col-resize',
        touchAction: 'none', // Let the drag move the bar instead of scrolling the page on touch screens.
        userSelect: 'none',
        display: 'flex',
        justifyContent: 'center',
        '&::before': {
          content: '""',
          width: 3,
          borderRadius: 2,
          bgcolor: 'divider',
          transition: 'background-color 0.15s',
        },
        '&:hover::before, &:focus-visible::before': { bgcolor: 'primary.main' },
        '&:focus-visible': { outline: 'none' },
      }}
    />
  );
}
