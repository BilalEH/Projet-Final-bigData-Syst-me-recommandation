import { useState } from 'react';
import { Box, Typography, LinearProgress, Chip, TextField, InputAdornment } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';

export default function RecommendationTable({ data }) {
  const [search, setSearch] = useState('');

  if (!data || data.length === 0) return null;

  const filtered = search
    ? data.filter((r) =>
        (r.product_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.user_id || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.category || '').toLowerCase().includes(search.toLowerCase())
      )
    : data;

  const columns = [
    { field: 'product_name', headerName: 'Produit', flex: 2, minWidth: 180,
      renderCell: (p) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{p.value}</Typography>
        </Box>
      ),
    },
    { field: 'user_id', headerName: 'Client', width: 80,
      renderCell: (p) => <Typography sx={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'text.secondary' }}>{p.value}</Typography>,
    },
    { field: 'category', headerName: 'Catégorie', width: 110,
      renderCell: (p) => <Chip label={p.value} size="small" sx={{ fontWeight: 600, fontSize: '0.6rem', bgcolor: 'rgba(37,99,235,0.1)', color: '#2563eb' }} />,
    },
    { field: 'score', headerName: 'Score', width: 80,
      renderCell: (p) => {
        const score = p.value ?? 0;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, width: '100%' }}>
            <Box sx={{ flex: 1, height: 4, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ height: '100%', borderRadius: 2, bgcolor: score >= 0.8 ? '#10b981' : score >= 0.5 ? '#2563eb' : '#ef4444', width: `${score * 100}%` }} />
            </Box>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, fontFamily: 'monospace', color: score >= 0.8 ? '#10b981' : score >= 0.5 ? '#2563eb' : '#ef4444' }}>
              {(score * 100).toFixed(0)}%
            </Typography>
          </Box>
        );
      },
    },
    { field: 'confidence', headerName: 'Confiance', width: 90,
      renderCell: (p) => {
        const conf = p.value ?? 0;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, width: '100%' }}>
            <Box sx={{ flex: 1, height: 4, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ height: '100%', borderRadius: 2, bgcolor: conf >= 0.8 ? '#10b981' : conf >= 0.5 ? '#2563eb' : '#ef4444', width: `${conf * 100}%` }} />
            </Box>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, fontFamily: 'monospace', color: conf >= 0.8 ? '#10b981' : conf >= 0.5 ? '#2563eb' : '#ef4444' }}>
              {(conf * 100).toFixed(0)}%
            </Typography>
          </Box>
        );
      },
    },
    { field: 'is_reordered', headerName: 'Ré-achat', width: 85,
      renderCell: (p) => (
        <Chip label={p.value ? 'Oui' : 'Non'} size="small"
          color={p.value ? 'success' : 'default'}
          variant={p.value ? 'filled' : 'outlined'}
          sx={{ fontWeight: 600, fontSize: '0.6rem' }} />
      ),
    },
    { field: 'price', headerName: 'Prix', width: 80,
      renderCell: (p) => <Typography sx={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>{(p.value || 0).toFixed(2)} MAD</Typography>,
    },
  ];

  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <Box sx={{ p: 2, pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>Détail des Recommandations</Typography>
          <TextField size="small" placeholder="Rechercher produit, client..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16 }} /></InputAdornment>,
              },
            }}
            sx={{ width: 260,
              '& .MuiOutlinedInput-root': { fontSize: '0.78rem', borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
            }} />
        </Box>
      </Box>
      <DataGrid
        rows={filtered.map((r, i) => ({ id: i, ...r }))}
        columns={columns}
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        disableRowSelectionOnClick
        sx={{
          border: 'none',
          '& .MuiDataGrid-cell': { fontSize: '0.75rem', py: 1, borderColor: 'divider' },
          '& .MuiDataGrid-columnHeaders': { bgcolor: 'rgba(255,255,255,0.02)', borderColor: 'divider', '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5 } },
          '& .MuiDataGrid-footerContainer': { borderColor: 'divider' },
          '& .MuiDataGrid-row': { '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } },
          '& .MuiDataGrid-virtualScroller': { minHeight: 300 },
        }}
      />
    </Box>
  );
}
