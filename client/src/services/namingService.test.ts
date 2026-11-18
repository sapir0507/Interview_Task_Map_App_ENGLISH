import { describe, expect, it } from 'vitest';
import { SymbolKey } from '../enums/symbolKey';
import { nextName, nextSymbol, symbolLabel } from './namingService';

describe('nextName', () => {
  it('starts at 1', () => {
    expect(nextName('Polygon', [])).toBe('Polygon 1');
  });

  it('goes one past the highest number, even after deletes', () => {
    expect(nextName('Polygon', ['Polygon 1', 'Polygon 4'])).toBe('Polygon 5');
  });

  it('ignores other prefixes and free names', () => {
    expect(nextName('Jeep', ['Truck 7', 'My Jeep', 'Jeep 2'])).toBe('Jeep 3');
  });
});

describe('symbols', () => {
  it('labels symbols', () => {
    expect(symbolLabel(SymbolKey.Jeep)).toBe('Jeep');
    expect(symbolLabel(SymbolKey.Truck)).toBe('Truck');
  });

  it('alternates Jeep and Truck, starting with Jeep', () => {
    expect([0, 1, 2, 3].map(nextSymbol)).toEqual([SymbolKey.Jeep, SymbolKey.Truck, SymbolKey.Jeep, SymbolKey.Truck]);
  });
});
