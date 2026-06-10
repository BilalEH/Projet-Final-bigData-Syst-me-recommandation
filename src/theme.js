import { createTheme } from '@mui/material';

const C = {
  blue: '#2563eb',
  blueDark: '#1d4ed8',
  blueLight: '#60a5fa',
  dark: '#0f172a',
  surface: '#1e293b',
  white: '#ffffff',
  border: '#334155',
  text: '#f1f5f9',
  textSec: '#94a3b8',
  textOff: '#64748b',
};

export default createTheme({
  palette: {
    mode: 'dark',
    primary: { main: C.blue, light: C.blueLight, dark: C.blueDark, contrastText: C.white },
    secondary: { main: C.surface },
    success: { main: '#10b981' },
    error: { main: '#ef4444' },
    warning: { main: '#f59e0b' },
    info: { main: C.blueLight },
    background: { default: C.dark, paper: C.surface },
    text: { primary: C.text, secondary: C.textSec, disabled: C.textOff },
    divider: C.border,
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    fontSize: 15,
    h5: { fontWeight: 700, fontSize: '1.35rem', letterSpacing: '-0.01em' },
    h6: { fontWeight: 700, fontSize: '1.15rem', letterSpacing: '-0.01em' },
    body1: { fontSize: '0.95rem' },
    body2: { fontSize: '0.85rem' },
  },
  shape: { borderRadius: 5 },
  components: {
    MuiCard: { styleOverrides: { root: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: 'none' } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600, borderRadius: 8, fontSize: '0.85rem' } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
    MuiDrawer: { styleOverrides: { paper: { background: C.surface, borderRight: `1px solid ${C.border}` } } },
    MuiAppBar: { styleOverrides: { root: { background: `rgba(15,23,42,0.88)`, backdropFilter: 'blur(14px)', borderBottom: `1px solid ${C.border}`, boxShadow: 'none' } } },
    MuiTab: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600, minHeight: 44, fontSize: '0.85rem' } } },
    MuiTooltip: { styleOverrides: { tooltip: { background: C.surface, border: `1px solid ${C.border}`, fontSize: '0.75rem', borderRadius: 6 } } },
    MuiLinearProgress: { styleOverrides: { root: { borderRadius: 4, background: 'rgba(255,255,255,0.06)' } } },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none', '& .MuiDataGrid-cell': { borderColor: C.border, fontSize: '0.82rem' },
          '& .MuiDataGrid-columnHeaders': { bgcolor: 'rgba(255,255,255,0.02)', borderColor: C.border, minHeight: '48px !important' },
          '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' },
          '& .MuiDataGrid-footerContainer': { borderColor: C.border },
          '& .MuiDataGrid-row:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
          '& .MuiDataGrid-virtualScroller': { minHeight: 300 },
        },
      },
    },
  },
});
