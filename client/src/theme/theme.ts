import { createTheme } from '@mui/material/styles';

/** The MUI theme. It implements the rules of DESIGN.md, so components never hard-code them. */
export const theme = createTheme({
  spacing: 8,
  palette: {
    primary: { main: '#1565c0' },
    error: { main: '#d32f2f' },
    text: { primary: '#212121', secondary: '#616161' },
    divider: '#e0e0e0',
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontSize: 24, fontWeight: 600 },
    h2: { fontSize: 18, fontWeight: 600 },
    subtitle2: { fontSize: 14, fontWeight: 600, textTransform: 'uppercase' },
    body1: { fontSize: 14, fontWeight: 400 },
    body2: { fontSize: 13, fontWeight: 400 },
    caption: { fontSize: 12, fontWeight: 400 },
  },
  components: {
    MuiPaper: { defaultProps: { variant: 'outlined', elevation: 0 } },
    MuiButton: {
      defaultProps: { size: 'small' },
      styleOverrides: { root: { textTransform: 'none' } },
    },
    MuiTable: { defaultProps: { size: 'small', stickyHeader: true } },
    MuiTableCell: {
      styleOverrides: { root: { padding: '6px 12px' } },
    },
  },
});
