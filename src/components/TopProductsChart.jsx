import { useState, useMemo } from 'react';
import { Box, Typography, Tabs, Tab, Autocomplete, TextField, Chip, Slider, InputAdornment } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { DataGrid } from '@mui/x-data-grid';
import { Search, TrendingUp, AlertTriangle } from 'lucide-react';
import { categoryStats } from '../data/dataLoader';

const COLORS = ['#2563eb', '#60a5fa', '#93c5fd', '#bfdbfe', '#2563eb', '#1e40af'];

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null;
}

export default function TopProductsChart({ data }) {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState(null);
  const [topN, setTopN] = useState(20);
  const [category, setCategory] = useState('all');

  const categories = useMemo(() => {
    const cats = [...new Set(data.map((p) => p.category))];
    return ['all', ...cats];
  }, [data]);

  const productOptions = useMemo(() =>
    data.map((p) => ({ label: `${p.name} — ${p.revenue.toLocaleString('fr-FR')} MAD | ${p.orders} cmd`, id: p.id })),
  [data]);

  const filtered = useMemo(() => {
    let arr = [...data];
    if (category !== 'all') arr = arr.filter((p) => p.category === category);
    if (search) {
      const q = search.label.split(' —')[0].toLowerCase();
      arr = arr.filter((p) => p.id === search.id || p.name.toLowerCase().includes(q));
    }
    return arr.sort((a, b) => b.revenue - a.revenue).slice(0, topN);
  }, [data, category, search, topN]);

  const totalRev = filtered.reduce((s, p) => s + p.revenue, 0);

  const columns = [
    { field: 'rank', headerName: '#', width: 50, renderCell: (p) => <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', fontFamily: 'monospace', fontWeight: 700 }}>{p.row.id + 1}</Typography> },
    { field: 'name', headerName: 'Produit', flex: 1, minWidth: 180, renderCell: (p) => <Typography sx={{ fontSize: '0.78rem', fontWeight: 500 }}>{p.value}</Typography> },
    { field: 'category', headerName: 'Catégorie', width: 120, renderCell: (p) => <Chip label={p.value} size="small" sx={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb', fontWeight: 600, fontSize: '0.65rem' }} /> },
    { field: 'revenue', headerName: 'Revenu', width: 130, type: 'number', renderCell: (p) => <Typography sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#10b981', fontSize: '0.82rem' }}>{p.value.toLocaleString('fr-FR')} MAD</Typography> },
    { field: 'orders', headerName: 'Commandes', width: 100, type: 'number', renderCell: (p) => <Typography sx={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{p.value.toLocaleString('fr-FR')}</Typography> },
    { field: 'avg_price', headerName: 'Prix Moy.', width: 100, type: 'number', renderCell: (p) => <Typography sx={{ fontFamily: 'monospace', fontSize: '0.72rem' }}>{p.value.toFixed(2)} MAD</Typography> },
    { field: 'reorder_rate', headerName: 'Ré-achat', width: 100, type: 'number', renderCell: (p) => (
      <Chip label={`${(p.value * 100).toFixed(0)}%`} size="small"
        color={p.value >= 0.7 ? 'success' : p.value >= 0.4 ? 'warning' : 'error'}
        variant="outlined" sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
    )},
    { field: 'stock', headerName: 'Stock', width: 80, type: 'number', renderCell: (p) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {p.value < 100 && <AlertTriangle size={12} color="#2563eb" />}
        <Typography sx={{ fontFamily: 'monospace', fontSize: '0.78rem', color: p.value < 100 ? '#2563eb' : '#f3f4f6' }}>{p.value}</Typography>
      </Box>
    )},
  ];

  const rows = filtered.map((p, i) => ({ id: i, ...p }));

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <TrendingUp size={20} color="#2563eb" />
        <Typography variant="h5">Analyse des Produits & Revenus</Typography>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 0.5 }}>
        <Tab label="Graphique Revenus" />
        <Tab label="Tableau Détail" />
        <Tab label="Analyse Catégories" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider', p: { xs: 1.5, md: 2.5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <Autocomplete size="small" options={productOptions} getOptionLabel={(o) => o.label}
              onChange={(_, v) => setSearch(v)} sx={{ width: { xs: '100%', sm: 300 } }}
              renderInput={(params) => {
                const { slotProps: sp, ...rest } = params;
                return <TextField {...rest} placeholder="Chercher un produit..."
                  slotProps={{
                    ...sp,
                    input: { ...sp?.input, startAdornment: <InputAdornment position="start"><Search size={16} color="#6b7280" /></InputAdornment> },
                  }} />;
              }} />
            <Chip label={category === 'all' ? 'Toutes catégories' : category} color="primary" variant="outlined"
              onDelete={category !== 'all' ? () => setCategory('all') : undefined} sx={{ fontWeight: 600 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 'auto' }}>
              <Typography variant="body2" sx={{ fontSize: '0.72rem' }}>Top {topN}</Typography>
              <Slider value={topN} onChange={(_, v) => setTopN(v)} min={5} max={100} step={5} sx={{ width: 100 }} />
            </Box>
          </Box>
          <BarChart dataset={filtered}
            xAxis={[{ scaleType: 'band', dataKey: 'name', tickLabelStyle: { fontSize: 9, angle: -30, textAnchor: 'end' } }]}
            yAxis={[{ tickFormatter: (v) => `${(v / 1000).toFixed(0)}k MAD` }]}
            series={[{ dataKey: 'revenue', label: 'Revenu', color: '#2563eb' }]}
            height={340} borderRadius={6}
            slotProps={{ legend: { hidden: true } }} />
          <Typography variant="body2" sx={{ mt: 1.5, textAlign: 'center', fontSize: '0.72rem' }}>
            Revenu cumulé affiché : <strong style={{ color: '#10b981' }}>{totalRev.toLocaleString('fr-FR')} MAD</strong> — {filtered.length} produits
          </Typography>
        </Box>
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', borderBottom: '1px solid', borderColor: 'divider' }}>
            {categories.map((c) => (
              <Chip key={c} label={c === 'all' ? 'Tous' : c} size="small" variant={category === c ? 'filled' : 'outlined'}
                color={category === c ? 'primary' : 'default'} onClick={() => setCategory(c)}
                sx={{ fontWeight: 600, cursor: 'pointer', fontSize: '0.7rem' }} />
            ))}
          </Box>
          <DataGrid rows={rows} columns={columns}
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            disableRowSelectionOnClick
            sx={{ '& .MuiDataGrid-cell': { py: 0.8 } }} />
        </Box>
      </TabPanel>

      <TabPanel value={tab} index={2}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
          <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider', p: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Répartition des Revenus par Catégorie</Typography>
            <PieChart series={[{ data: categoryStats.map((c, i) => ({ id: i, value: c.percentage, label: c.name, color: COLORS[i % COLORS.length] })), innerRadius: 45, outerRadius: 85, paddingAngle: 2 }]}
              height={280} />
          </Box>
          <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider', p: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Performances par Catégorie</Typography>
            {categoryStats.map((c, i) => (
              <Box key={c.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.2, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLORS[i % COLORS.length] }} />
                  <Box>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 500 }}>{c.name}</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.65rem' }}>{c.products} produits</Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontWeight: 700, color: '#2563eb', fontSize: '0.85rem' }}>{c.percentage}%</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.65rem', color: c.growth > 0 ? '#10b981' : '#ef4444' }}>
                    {c.growth > 0 ? '+' : ''}{c.growth}% vs N-1
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </TabPanel>
    </Box>
  );
}
