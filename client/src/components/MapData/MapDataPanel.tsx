import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';
import { useSavedMapData } from '../../hooks/useSavedMapData';
import { clearSelection, setSelection, toggleSelection } from '../../store/slices/mapDataSlice';
import { Panel } from '../common/Panel';
import { ObjectTree } from './ObjectTree';

/** Map Data: one row per saved polygon and object. Selecting rows selects them on the map. */
export function MapDataPanel() {
  const dispatch = useAppDispatch();
  const { rows, loadError } = useSavedMapData();
  const selectedIds = useAppSelector((state) => state.mapData.selectedIds);

  const selectedCount = rows.filter((row) => selectedIds.includes(row.id)).length;
  const allSelected = rows.length > 0 && selectedCount === rows.length;

  const handleSelectAll = () => {
    dispatch(allSelected ? clearSelection() : setSelection(rows.map((row) => row.id)));
  };

  return (
    <Panel title="Map Data">
      <TableContainer sx={{ flex: 1, minHeight: 0 }}>
        <Table aria-label="Map data">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  id="select-all-graphics-on-the-map"
                  name="select-all-graphics-on-the-map"
                  size="small"
                  checked={allSelected} // Show a "check" icon when all rows are selected.
                  indeterminate={selectedCount > 0 && !allSelected} // Show a "minus" icon when some but not all rows are selected.
                  onChange={handleSelectAll}
                  disabled={rows.length === 0}
                  slotProps={{ input: { 'aria-label': 'Select all' } }}
                />
              </TableCell>
              <TableCell align="left">Object</TableCell>
              <TableCell align="right" sx={{ px: 1 }}>
                Lat
              </TableCell>
              <TableCell align="right" sx={{ px: 1 }}>
                Lon
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={loadError ? { color: 'error.main' } : undefined}>
                  {loadError ? `Could not load the saved data: ${loadError}` : 'Nothing saved yet'}
                </TableCell>
              </TableRow>
            )}
            {rows.map((row) => {
              const selected = selectedIds.includes(row.id);
              return (
                <TableRow key={row.id} hover selected={selected} onClick={() => dispatch(toggleSelection(row.id))}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      size="small"
                      checked={selected}
                      onChange={() => dispatch(toggleSelection(row.id))}
                      onClick={(event) => event.stopPropagation()}
                      slotProps={{ input: { 'aria-label': `Select ${row.name}` } }}
                    />
                  </TableCell>
                  <TableCell align="left" sx={{ maxWidth: 170 }}>
                    {/* A long tree scrolls inside its cell, so the Lat and Lon columns stay in view. */}
                    <Box sx={{ overflowX: 'auto' }}>
                      <ObjectTree label="name" value={row.name} />
                      <ObjectTree label="type" value={row.type} />
                      <ObjectTree label="object" value={row.object} />
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ px: 1 }}>
                    {row.lat.toFixed(6)}
                  </TableCell>
                  <TableCell align="right" sx={{ px: 1 }}>
                    {row.lon.toFixed(6)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Panel>
  );
}
