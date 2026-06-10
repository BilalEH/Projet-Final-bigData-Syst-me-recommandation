import { Box, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import MemoryIcon from '@mui/icons-material/Memory';

export default function FeatureImportanceChart({ data }) {
  if (!data || data.length === 0) return null;

  const chartData = [...data].sort((a, b) => b.importance - a.importance).slice(0, 10);

  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 2.5, border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <MemoryIcon sx={{ color: '#2563eb', fontSize: 20 }} />
        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>Importance des Features</Typography>
      </Box>
      <BarChart
        dataset={chartData}
        yAxis={[{ scaleType: 'band', dataKey: 'feature', tickLabelStyle: { fontSize: 11 } }]}
        series={[{ dataKey: 'importance', valueFormatter: (v) => `${(v * 100).toFixed(1)}%` }]}
        layout="horizontal"
        height={300}
        margin={{ left: 160, right: 20, top: 10, bottom: 10 }}
        slotProps={{ legend: { hidden: true } }}
        sx={{ '& .MuiBarElement-root': { fill: '#2563eb' } }}
      />
    </Box>
  );
}
