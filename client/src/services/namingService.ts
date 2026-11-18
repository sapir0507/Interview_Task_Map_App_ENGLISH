import { SymbolKey } from '../enums/symbolKey';

/** The next free name for a prefix: "Polygon 3" when "Polygon 1" and "Polygon 2" exist. */
export function nextName(prefix: string, existingNames: string[]): string {
  const pattern = new RegExp(`^${prefix} (\\d+)$`);
  const highest = existingNames.reduce((max, name) => {
    const match = pattern.exec(name);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `${prefix} ${highest + 1}`;
}

/** Display label of a symbol, also used as the prefix of the names it gets. */
export function symbolLabel(symbolKey: SymbolKey): string {
  return symbolKey === SymbolKey.Jeep ? 'Jeep' : 'Truck';
}

/** The symbols Add places, in turn. The Objects panel has no symbol picker, so each Add takes the next one. */
const SYMBOL_CYCLE: readonly SymbolKey[] = [SymbolKey.Jeep, SymbolKey.Truck];

/** The symbol the next Add places: Jeep, Truck, Jeep, Truck... given how many objects exist (saved and unsaved). */
export function nextSymbol(objectCount: number): SymbolKey {
  return SYMBOL_CYCLE[objectCount % SYMBOL_CYCLE.length];
}
