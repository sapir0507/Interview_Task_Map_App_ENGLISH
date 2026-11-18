import Box from '@mui/material/Box';
import { useState } from 'react';
import { MapPanel } from './components/Map/MapPanel';
import { MapDataPanel } from './components/MapData/MapDataPanel';
import { ObjectsPanel } from './components/Objects/ObjectsPanel';
import { PolygonPanel } from './components/Polygon/PolygonPanel';
import { Notifier } from './components/common/Notifier';
import { ResizeHandle } from './components/common/ResizeHandle';
import { SIDE_PANEL_DEFAULT_WIDTH_PX } from './constants/appConstants';

/** The four panels: Map on the left, Polygon, Objects and Map Data stacked on the right. The bar between them resizes the right side. */
export default function App() {
  const [sideWidth, setSideWidth] = useState(SIDE_PANEL_DEFAULT_WIDTH_PX);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `minmax(0, 1fr) 12px ${sideWidth}px`,
        gap: 0,
        p: 1,
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <MapPanel />
      <ResizeHandle width={sideWidth} onChange={setSideWidth} />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gridTemplateRows: 'auto auto minmax(0, 1fr)',
          gap: 1,
          minHeight: 0,
        }}
      >
        <PolygonPanel />
        <ObjectsPanel />
        <MapDataPanel />
      </Box>
      <Notifier />
    </Box>
  );
}
