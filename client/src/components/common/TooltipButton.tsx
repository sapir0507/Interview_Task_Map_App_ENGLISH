import Button from '@mui/material/Button';
import type { ButtonProps } from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

interface TooltipButtonProps extends ButtonProps {
  /** Helper text shown on hover. */
  tooltip: string;
  /** Called when a disabled button is clicked (the click lands on the wrapper, since the button ignores it). */
  onDisabledClick?: () => void;
}

/**
 * A Button with a hover tooltip. The span lets the tooltip show on a disabled button too, because a disabled
 * button receives no pointer events. For the same reason a click on a disabled button reaches the span, which
 * reports it through <code>onDisabledClick</code>.
 */
export function TooltipButton({ tooltip, onDisabledClick, ...buttonProps }: TooltipButtonProps) {
  return (
    <Tooltip title={tooltip}>
      <span onClick={buttonProps.disabled ? onDisabledClick : undefined}>
        <Button {...buttonProps} />
      </span>
    </Tooltip>
  );
}
