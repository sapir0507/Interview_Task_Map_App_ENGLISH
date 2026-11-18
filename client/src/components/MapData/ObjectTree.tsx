import ButtonBase from '@mui/material/ButtonBase';
import Box from '@mui/material/Box';
import { useState } from 'react';

/** How many levels start open: the row's `object`, showing its `geometry` closed. Deeper levels start closed. */
const OPEN_DEPTH = 1;

const TREE_FONT = {
  fontFamily: 'ui-monospace, Consolas, monospace',
  fontSize: 12,
  lineHeight: 1.6,
  whiteSpace: 'nowrap',
} as const;

/** Anything that can be shown: an object, an array or a plain value. */
type TreeValue = unknown;

interface ObjectTreeProps {
  /** The name shown before the colon, e.g. `object`. */
  label: string;
  /** The value to show. */
  value: TreeValue;
  /** Nesting level, the root is 0. */
  depth?: number;
}

/** True for a position such as [lng, lat]: a flat list of numbers is shown on one line instead of one row per number. */
function isNumberList(value: TreeValue): value is number[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'number');
}

function formatLeaf(value: TreeValue): string {
  if (typeof value === 'string') return `"${value}"`;
  if (isNumberList(value)) return `[${value.join(', ')}]`;
  return String(value);
}

/**
 * A collapsible view of a value, in the style of a MongoDB document viewer: `key: Object (2)` can be opened to show
 * its fields, and so on down to plain values. Used in the Map Data table to show each row's object.
 */
export function ObjectTree({ label, value, depth = 0 }: ObjectTreeProps) {
  const [open, setOpen] = useState(depth < OPEN_DEPTH);

  const isBranch = typeof value === 'object' && value !== null && !isNumberList(value);
  if (!isBranch) {
    return (
      <Box sx={{ ...TREE_FONT, pl: depth === 0 ? 0 : 2.5 }}>
        {label}:{' '}
        <Box component="span" sx={{ color: typeof value === 'string' ? 'success.dark' : 'info.dark' }}>
          {formatLeaf(value)}
        </Box>
      </Box>
    );
  }

  const entries: [string, TreeValue][] = Array.isArray(value)
    ? value.map((item, index) => [String(index), item])
    : Object.entries(value as Record<string, TreeValue>);
  const summary = `${Array.isArray(value) ? 'Array' : 'Object'} (${entries.length})`;

  return (
    <Box sx={{ pl: depth === 0 ? 0 : 2.5 }}>
      <ButtonBase
        aria-expanded={open}
        aria-label={`${label}: ${summary}`}
        // The row selects itself on click, so opening a node must not also toggle the selection.
        onClick={(event) => {
          event.stopPropagation();
          setOpen((current) => !current);
        }}
        sx={{ ...TREE_FONT, justifyContent: 'flex-start', alignItems: 'baseline', gap: 0.5, textAlign: 'left' }}
      >
        <span aria-hidden>{open ? '▾' : '▸'}</span>
        <span>
          {label}: {summary}
        </span>
      </ButtonBase>
      {open && entries.map(([key, child]) => <ObjectTree key={key} label={key} value={child} depth={depth + 1} />)}
    </Box>
  );
}
