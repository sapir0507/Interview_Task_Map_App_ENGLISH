import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ObjectTree } from './ObjectTree';

const value = { geometry: { type: 'Polygon', coordinates: [[[35.1, 32.0]]] } };

describe('ObjectTree', () => {
  it('shows plain values on one line', () => {
    render(<ObjectTree label="name" value="Polygon 1" />);
    expect(screen.getByText(/name:/)).toHaveTextContent('name: "Polygon 1"');
  });

  it('starts with the object open and its geometry closed', () => {
    render(<ObjectTree label="object" value={value} />);
    expect(screen.getByRole('button', { name: 'object: Object (1)' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'geometry: Object (2)' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText(/coordinates/)).not.toBeInTheDocument();
  });

  it('opens a closed node, down to the coordinates', () => {
    render(<ObjectTree label="object" value={value} />);
    fireEvent.click(screen.getByRole('button', { name: 'geometry: Object (2)' }));
    fireEvent.click(screen.getByRole('button', { name: 'coordinates: Array (1)' }));
    fireEvent.click(screen.getByRole('button', { name: '0: Array (1)' }));
    expect(screen.getByText('[35.1, 32]')).toBeInTheDocument();
  });

  it('does not let a click on a node reach the row', () => {
    const onRowClick = vi.fn();
    render(
      <div onClick={onRowClick}>
        <ObjectTree label="object" value={value} />
      </div>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'geometry: Object (2)' }));
    expect(onRowClick).not.toHaveBeenCalled();
  });
});
