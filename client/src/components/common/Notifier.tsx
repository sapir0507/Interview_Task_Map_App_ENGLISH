import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';
import { dismiss } from '../../store/slices/notificationSlice';

/** Shows the latest error (a failed call, for example) at the bottom of the screen. */
export function Notifier() {
  const dispatch = useAppDispatch();
  const message = useAppSelector((state) => state.notification.message);

  return (
    <Snackbar open={message !== null} autoHideDuration={6000} onClose={() => dispatch(dismiss())}>
      <Alert severity="error" variant="filled" onClose={() => dispatch(dismiss())}>
        {message}
      </Alert>
    </Snackbar>
  );
}
