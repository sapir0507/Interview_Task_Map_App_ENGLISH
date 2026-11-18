import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  OBJECT_ADD_TOOLTIP_TEXT,
  OBJECT_DELETE_TOOLTIP_TEXT,
  OBJECT_SAVE_TOOLTIP_TEXT,
} from '../../constants/appConstants';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';
import { useSavedMapData } from '../../hooks/useSavedMapData';
import { toErrorMessage } from '../../services/errorService';
import { nextSymbol, symbolLabel } from '../../services/namingService';
import { useDeleteObjectMutation, useSaveObjectsMutation } from '../../services/taskMapApi';
import { setSelection } from '../../store/slices/mapDataSlice';
import { notify } from '../../store/slices/notificationSlice';
import { clearPending, removePending, startPlacing } from '../../store/slices/objectsSlice';
import { cancelDrawing } from '../../store/slices/polygonSlice';
import { Panel } from '../common/Panel';
import { TooltipButton } from '../common/TooltipButton';

/** Object management: Add (place the next image symbol: jeep, truck, jeep...), Save (POST the list) and Delete (DELETE the selected). */
export function ObjectsPanel() {
  const dispatch = useAppDispatch();
  const { objects } = useSavedMapData();
  const { placing, pending } = useAppSelector((state) => state.objects);
  const selectedIds = useAppSelector((state) => state.mapData.selectedIds);
  const [saveObjects, { isLoading: isSaving }] = useSaveObjectsMutation();
  const [deleteObject, { isLoading: isDeleting }] = useDeleteObjectMutation();

  const handleAdd = () => {
    dispatch(cancelDrawing());
    dispatch(startPlacing(nextSymbol(objects.length + pending.length)));
  };

  const handleSave = async () => {
    // Unsaved objects have a client-made id. The server makes the real one.
    const newObjects = pending.map(({ id: _id, ...object }) => object);
    try {
      await saveObjects(newObjects).unwrap();
      dispatch(clearPending());
    } catch (error) {
      dispatch(notify(toErrorMessage(error)));
    }
  };

  const pendingIds = selectedIds.filter((id) => pending.some((object) => object.id === id));
  const savedIds = selectedIds.filter((id) => objects.some((object) => object.id === id));
  const hasSelectedObject = pendingIds.length > 0 || savedIds.length > 0;

  const handleDelete = async () => {
    // Unsaved objects only exist on the client.
    dispatch(removePending(pendingIds));
    try {
      await Promise.all(savedIds.map((id) => deleteObject(id).unwrap()));
    } catch (error) {
      dispatch(notify(toErrorMessage(error)));
    }
    const removed = [...pendingIds, ...savedIds];
    dispatch(setSelection(selectedIds.filter((id) => !removed.includes(id))));
  };

  return (
    <Panel title="Objects">
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        <TooltipButton tooltip={OBJECT_ADD_TOOLTIP_TEXT} variant="contained" onClick={handleAdd}>
          Add
        </TooltipButton>
        <TooltipButton
          tooltip={OBJECT_SAVE_TOOLTIP_TEXT}
          variant="contained"
          onClick={handleSave}
          disabled={pending.length === 0 || isSaving}
        >
          Save
        </TooltipButton>
        <TooltipButton
          tooltip={OBJECT_DELETE_TOOLTIP_TEXT}
          variant="outlined"
          color="error"
          onClick={handleDelete}
          disabled={!hasSelectedObject || isDeleting}
        >
          Delete
        </TooltipButton>
      </Box>
      <Typography variant="caption" color="text.secondary">
        {placing
          ? `Click the map to place the ${symbolLabel(placing)}.`
          : pending.length > 0
            ? `${pending.length} unsaved. Save sends them to the server.`
            : 'Press Add, then click the map to place the object.'}
      </Typography>
    </Panel>
  );
}
