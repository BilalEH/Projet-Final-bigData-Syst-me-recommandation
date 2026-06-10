import { Box, Typography, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const METRICS_CONFIG = [
  { key: 'accuracy', label: 'Accuracy', desc: 'Proportion de prédictions correctes parmi toutes les prédictions.', color: '#10b981', bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.15)' },
  { key: 'precision', label: 'Precision', desc: 'Proportion de vrais positifs parmi les prédictions positives.', color: '#2563eb', bg: 'rgba(37,99,235,0.06)', border: 'rgba(37,99,235,0.15)' },
  { key: 'recall', label: 'Recall', desc: 'Proportion de vrais positifs détectés parmi tous les positifs réels.', color: '#6366f1', bg: 'rgba(99,102,241,0.06)', border: 'rgba(99,102,241,0.15)' },
  { key: 'f1_score', label: 'F1-Score', desc: 'Moyenne harmonique de precision et recall.', color: '#8b5cf6', bg: 'rgba(139,92,246,0.06)', border: 'rgba(139,92,246,0.15)' },
];

export default function ModelMetricsCard({ metrics, detailed }) {
  if (!metrics) return null;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
      {METRICS_CONFIG.map((m) => {
        const val = metrics[m.key] ?? 0;
        const pct = (val * 100).toFixed(1);
        return (
          <Box key={m.key} sx={{ p: 2, borderRadius: 2, background: m.bg, border: `1px solid ${m.border}`, position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: 'text.secondary' }}>{m.label}</Typography>
              <Tooltip title={m.desc} arrow placement="top">
                <InfoOutlinedIcon sx={{ fontSize: 14, color: 'text.disabled', cursor: 'help' }} />
              </Tooltip>
            </Box>
            <Typography sx={{ fontSize: '1.35rem', fontWeight: 700, fontFamily: 'monospace', color: m.color }}>{pct}%</Typography>
            <Box sx={{ mt: 1, height: 5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <Box sx={{ height: '100%', borderRadius: 3, bgcolor: m.color, width: `${Math.min(pct, 100)}%` }} />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
