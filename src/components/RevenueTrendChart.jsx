import { Box, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { TrendingUp } from 'lucide-react';

export default function RevenueTrendChart({ data }) {
  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const totalPrev = data.reduce((s, d) => s + d.prev_year, 0);
  const growth = ((totalRevenue - totalPrev) / totalPrev * 100).toFixed(1);

  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider', p: { xs: 2, md: 2.5 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp size={18} color="#2563eb" />
          <Typography variant="h6">Évolution du Revenu Mensuel</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ px: 1, py: 0.3, borderRadius: 1, background: 'rgba(16,185,129,0.1)' }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981' }}>+{growth}% vs 2025</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, fontSize: '0.65rem', color: '#9ca3af' }}>
            <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#2563eb', marginRight: 4 }} />2026</span>
            <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#1e40af', marginRight: 4 }} />2025</span>
          </Box>
        </Box>
      </Box>
      <LineChart dataset={data || []}
        xAxis={[{ dataKey: 'month', scaleType: 'band', tickLabelStyle: { fontSize: 11 } }]}
        yAxis={[{ tickFormatter: (v) => `${(v / 1000).toFixed(0)}k MAD` }]}
        series={[
          { dataKey: 'prev_year', label: '2025', color: '#1e40af', showMark: false, valueFormatter: (v) => `${v.toLocaleString('fr-FR')} MAD` },
          { dataKey: 'revenue', label: '2026', color: '#2563eb', showMark: true, area: true, valueFormatter: (v) => `${v.toLocaleString('fr-FR')} MAD` },
        ]}
        hideLegend
        height={300}
      />
      <Typography variant="body2" sx={{ mt: 1.5, textAlign: 'center', fontSize: '0.7rem', color: '#6b7280' }}>
        Revenu total 2026 : <strong style={{ color: '#2563eb' }}>{totalRevenue.toLocaleString('fr-FR')}</strong> MAD vs 2025 : <strong style={{ color: '#1e40af' }}>{totalPrev.toLocaleString('fr-FR')}</strong> MAD
      </Typography>
    </Box>
  );
}
