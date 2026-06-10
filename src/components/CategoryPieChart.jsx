import { Box, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import CategoryIcon from '@mui/icons-material/Category';

export default function CategoryPieChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 2.5, border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <CategoryIcon sx={{ color: '#2563eb', fontSize: 20 }} />
        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>Répartition par Catégorie</Typography>
      </Box>
      <PieChart
        series={[{
          data: data.map((d) => ({ id: d.name, value: d.percentage, label: d.name })),
          innerRadius: 50,
          outerRadius: 90,
          paddingAngle: 3,
          cornerRadius: 4,
        }]}
        slotProps={{
          legend: { hidden: true },
        }}
        height={240}
        margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', mt: 1 }}>
        {data.map((c) => (
          <Box key={c.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#2563eb', opacity: 0.6 + (data.indexOf(c) / data.length) * 0.4 }} />
            <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>{c.name}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
