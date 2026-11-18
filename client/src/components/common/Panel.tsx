import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

interface PanelProps {
  /** Panel header. */
  title: string;
  children: ReactNode;
}

/** A titled panel: header, divider, then the content. */
export function Panel({ title, children }: PanelProps) {
  return (
    <Paper component="section" aria-label={title} sx={{ p: 2, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Typography variant="h2" component="h2">
        {title}
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minHeight: 0, flex: 1 }}>{children}</Box>
    </Paper>
  );
}
