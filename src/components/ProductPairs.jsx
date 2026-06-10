import { Box, Typography, LinearProgress } from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

export default function ProductPairs({ pairs, products }) {
  if (!pairs || pairs.length === 0) return null;

  const topPairs = [...pairs].sort((a, b) => b.count - a.count).slice(0, 8);
  const maxCount = topPairs[0]?.count || 1;

  const findName = (id) => {
    const p = products?.find((pr) => pr.id === id);
    return p ? p.name : id;
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 2.5, border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <ShoppingBagOutlinedIcon sx={{ color: '#2563eb', fontSize: 20 }} />
        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>Paires de Produits Fréquents</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {topPairs.map((pair, i) => {
          const pct = (pair.count / maxCount * 100);
          return (
            <Box key={i}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                  {pair.product_a} ↔ {pair.product_b}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, fontFamily: 'monospace', color: '#2563eb' }}>{pair.count}</Typography>
              </Box>
              <LinearProgress variant="determinate" value={pct} sx={{ height: 5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: '#2563eb', borderRadius: 3 } }} />
            </Box>
          );
        })}
      </Box>
      <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', textAlign: 'center', mt: 1.5 }}>
        Ces paires représentent les produits les plus souvent achetés ensemble — opportunités de cross-selling
      </Typography>
    </Box>
  );
}
