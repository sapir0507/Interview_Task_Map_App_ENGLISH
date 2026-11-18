import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  DELETE_HINT_CLICKS,
  DELETE_HINT_TEXT,
  DELETE_TOOLTIP_TEXT,
  POLYGON_ADD_TOOLTIP_TEXT,
  POLYGON_SAVE_TOOLTIP_TEXT,
} from '../../constants/appConstants';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';
import { useSavedMapData } from '../../hooks/useSavedMapData';
import { toErrorMessage } from '../../services/errorService';
import { nextName } from '../../services/namingService';
import { useCreatePolygonMutation, useDeletePolygonsMutation } from '../../services/taskMapApi';
import { setSelection } from '../../store/slices/mapDataSlice';
import { notify } from '../../store/slices/notificationSlice';
import { stopPlacing } from '../../store/slices/objectsSlice';
import { clearDraft, emptyDeleteClick, startDrawing } from '../../store/slices/polygonSlice';
import { Panel } from '../common/Panel';
import { TooltipButton } from '../common/TooltipButton';

/** Polygon management: Add (draw), Save (POST) and Delete (DELETE the selected polygons). */
export function PolygonPanel() {
  const dispatch = useAppDispatch();
  const { polygons } = useSavedMapData();
  const { isDrawing, draft, emptyDeleteClicks } = useAppSelector((state) => state.polygon);
  const selectedIds = useAppSelector((state) => state.mapData.selectedIds);
  const [createPolygon, { isLoading: isSaving }] = useCreatePolygonMutation();
  const [deletePolygons, { isLoading: isDeleting }] = useDeletePolygonsMutation();

  const selectedPolygonIds = selectedIds.filter((id) => polygons.some((polygon) => polygon.id === id));

  const handleAdd = () => {
    dispatch(stopPlacing());
    dispatch(startDrawing());
  };

  const handleSave = async () => {
    if (!draft) return;
    const name = nextName(
      'Polygon',
      polygons.map((polygon) => polygon.name),
    );
    try {
      await createPolygon({ name, geometry: draft }).unwrap();
      dispatch(clearDraft());
    } catch (error) {
      dispatch(notify(toErrorMessage(error)));
    }
  };

  // Delete is disabled with nothing selected. Clicking it anyway still counts toward the red hint.
  const handleEmptyDelete = () => dispatch(emptyDeleteClick());

  const handleDelete = async () => {
    try {
      await deletePolygons(selectedPolygonIds).unwrap();
      dispatch(setSelection(selectedIds.filter((id) => !selectedPolygonIds.includes(id))));
    } catch (error) {
      dispatch(notify(toErrorMessage(error)));
    }
  };

  return (
    <Panel title="Polygon">
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TooltipButton tooltip={POLYGON_ADD_TOOLTIP_TEXT} variant="contained" onClick={handleAdd} disabled={isDrawing}>
          Add
        </TooltipButton>
        <TooltipButton
          tooltip={POLYGON_SAVE_TOOLTIP_TEXT}
          variant="contained"
          onClick={handleSave}
          disabled={!draft || isSaving}
        >
          Save
        </TooltipButton>
        <TooltipButton
          tooltip={DELETE_TOOLTIP_TEXT}
          variant="outlined"
          color="error"
          onClick={handleDelete}
          onDisabledClick={selectedPolygonIds.length === 0 ? handleEmptyDelete : undefined}
          disabled={selectedPolygonIds.length === 0 || isDeleting}
        >
          Delete
        </TooltipButton>
      </Box>
      <Typography variant="caption" color="text.secondary">
        {isDrawing
          ? 'Click the map to add vertices. Click the first vertex to close the polygon.'
          : 'Ctrl + drag on the map selects every polygon the box touches.'}
      </Typography>
      {emptyDeleteClicks >= DELETE_HINT_CLICKS && (
        <Typography variant="caption" color="error" role="alert">
          {DELETE_HINT_TEXT}
        </Typography>
      )}
    </Panel>
  );
}
