/** Map colors. Kept in one place, mirrored in DESIGN.md (Map symbology). */
export const MapColors = {
  pointFill: '#1e88e5',
  pointBorder: '#0d47a1',
  line: '#0a0a0a',
  polygonFill: [30, 136, 229, 0.15] as [number, number, number, number],
  polygonFillSelected: [255, 179, 0, 0.3] as [number, number, number, number],
  highlight: '#ffb300',
  selectionBoxFill: [30, 136, 229, 0.15] as [number, number, number, number],
  selectionBoxOutline: [30, 136, 229, 0.9] as [number, number, number, number],
} as const;
