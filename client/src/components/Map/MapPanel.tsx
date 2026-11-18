import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useRef } from 'react';
import { useAppSelector } from '../../hooks/storeHooks';
import { useGraphicsSync } from '../../hooks/useGraphicsSync';
import { useMapInteractions } from '../../hooks/useMapInteractions';
import { useMapView } from '../../hooks/useMapView';
import { useSavedMapData } from '../../hooks/useSavedMapData';

/** The interactive map. The ArcGIS view lives in hooks and refs, and is drawn from the store's data. */
export function MapPanel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const context = useMapView(containerRef);
  const { polygons, objects } = useSavedMapData();
  const pending = useAppSelector((state) => state.objects.pending);
  const draft = useAppSelector((state) => state.polygon.draft);
  const selectedIds = useAppSelector((state) => state.mapData.selectedIds);
  const isDrawing = useAppSelector((state) => state.polygon.isDrawing);
  const placing = useAppSelector((state) => state.objects.placing);

  useGraphicsSync(context, { polygons, objects, pending, draft, selectedIds });
  useMapInteractions(context);

  return (
    <Paper component="section" aria-label="Map" sx={{ overflow: 'hidden', minHeight: 0 }}>
      <Box
        ref={containerRef}
        sx={{
          width: '100%',
          height: '100%',
          // A (+) crosshair style cursor while drawing a polygon or placing an object.
          '& .esri-view-surface': { cursor: isDrawing || placing ? 'crosshair !important' : undefined },
        }}
      />
    </Paper>
  );
}
