import { Box, Typography } from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

export default function BasketStats({ baskets, transactions }) {
  if (!baskets || baskets.length === 0) return null;

  const avgItems = baskets.reduce((s, b) => s + b.products.length, 0) / baskets.length;
  const totalRev = transactions?.total_revenue || 0;
  const avgOrder = transactions?.avg_per_order || 0;

  const stats = [
    { label: 'Paniers Analysés', value: baskets.length.toLocaleString('fr-FR'), color: '#2563eb' },
    { label: 'Articles Moy./Panier', value: avgItems.toFixed(1), color: '#10b981' },
    { label: 'Chiffre d\'Affaires Total', value: `${(totalRev / 1e6).toFixed(1)}M MAD`, color: '#6366f1' },
    { label: 'Paniers Moy. par Commande', value: avgOrder.toFixed(2), color: '#8b5cf6' },
  ];

  const sample = baskets.slice(0, 5);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 2.5, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <ShoppingBagOutlinedIcon sx={{ color: '#2563eb', fontSize: 20 }} />
          <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>Statistiques Paniers</Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          {stats.map((s) => (
            <Box key={s.label} sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
              <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'monospace', color: s.color }}>{s.value}</Typography>
              <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary', mt: 0.3 }}>{s.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 2.5, border: '1px solid', borderColor: 'divider' }}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, mb: 1.5 }}>
          Échantillon de Paniers
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {sample.map((b, i) => (
            <Box key={b.order_id} sx={{ p: 1.5, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: 'text.secondary' }}>Panier #{b.order_id}</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563eb' }}>{b.total?.toFixed(2) || '—'} MAD</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {b.products.slice(0, 5).map((p, j) => (
                  <Typography key={j} sx={{ fontSize: '0.6rem', px: 0.8, py: 0.3, borderRadius: 0.8, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid', borderColor: 'divider', color: 'text.secondary' }}>
                    {p}
                  </Typography>
                ))}
                {b.products.length > 5 && (
                  <Typography sx={{ fontSize: '0.6rem', color: 'text.disabled' }}>+{b.products.length - 5}</Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
