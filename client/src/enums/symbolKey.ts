/** Key of the image drawn for an Object. The picture is resolved on the client, never stored as ArcGIS JSON. */
export const SymbolKey = {
  Jeep: 'jeep',
  Truck: 'truck',
} as const;

export type SymbolKey = (typeof SymbolKey)[keyof typeof SymbolKey];
