/** Type of a row in the Map Data table. A polygon counts as an object. */
export const MapItemType = {
  Polygon: 'Polygon',
  Object: 'Object',
} as const;

export type MapItemType = (typeof MapItemType)[keyof typeof MapItemType];
