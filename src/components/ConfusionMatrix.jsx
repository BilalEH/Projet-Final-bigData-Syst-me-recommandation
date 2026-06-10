import { Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function ConfusionMatrix({ data }) {
  if (!data) return null;

  const { true_positives: tp, false_positives: fp, true_negatives: tn, false_negatives: fn } = data;
  const total = tp + fp + fn + tn || 1;
  const accuracy = ((tp + tn) / total * 100).toFixed(1);

  const cells = [
    { label: 'Vrai Positif (TP)', value: tp, desc: 'Produits correctement recommandés', color: '#10b981', bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.15)' },
    { label: 'Faux Positif (FP)', value: fp, desc: 'Produits recommandés à tort', color: '#ef4444', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.15)' },
    { label: 'Faux Négatif (FN)', value: fn, desc: 'Produits non recommandés qui auraient dû l\'être', color: '#ef4444', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.15)' },
    { label: 'Vrai Négatif (TN)', value: tn, desc: 'Produits correctement non recommandés', color: '#10b981', bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.15)' },
  ];

  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 2.5, border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <InfoOutlinedIcon sx={{ color: '#2563eb', fontSize: 20 }} />
        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>Matrice de Confusion</Typography>
        <Box sx={{ ml: 'auto', px: 1.5, py: 0.5, borderRadius: 1, bgcolor: 'rgba(16,185,129,0.1)' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#10b981' }}>Accuracy globale : {accuracy}%</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
        {cells.map((c) => (
          <Box key={c.label} sx={{ p: 2, borderRadius: 2, background: c.bg, border: `1px solid ${c.border}` }}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>{c.label}</Typography>
            <Typography sx={{ fontSize: '1.35rem', fontWeight: 700, fontFamily: 'monospace', color: c.color }}>{c.value.toLocaleString('fr-FR')}</Typography>
            <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', mt: 0.5 }}>{c.desc}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
