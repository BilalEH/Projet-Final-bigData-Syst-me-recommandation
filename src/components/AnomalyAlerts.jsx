import { useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';

const SEVERITY_META = {
  high: { label: 'CRITIQUE', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
  medium: { label: 'MOYENNE', color: '#2563eb', bg: 'rgba(37,99,235,0.1)', border: 'rgba(37,99,235,0.2)' },
  low: { label: 'FAIBLE', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
};

const SEVERITY_ICONS = { high: ErrorOutlinedIcon, medium: WarningAmberIcon, low: InfoOutlinedIcon };

export default function AnomalyAlerts({ data }) {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const alerts = data || [];

  const filtered = filter === 'all' ? alerts : alerts.filter((a) => a.severity === filter);
  const counts = {
    all: alerts.length,
    high: alerts.filter((a) => a.severity === 'high').length,
    medium: alerts.filter((a) => a.severity === 'medium').length,
    low: alerts.filter((a) => a.severity === 'low').length,
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <ShieldOutlinedIcon sx={{ color: '#2563eb', fontSize: 22 }} />
        <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Alertes de Sécurité & Anomalies</Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: 'Toutes', icon: null },
          { key: 'high', label: 'Critiques', icon: ErrorOutlinedIcon },
          { key: 'medium', label: 'Moyennes', icon: WarningAmberIcon },
          { key: 'low', label: 'Faibles', icon: InfoOutlinedIcon },
        ].map((chip) => {
          const active = filter === chip.key;
          const meta = chip.key === 'all' ? { color: '#2563eb', bg: 'rgba(37,99,235,0.1)', border: 'rgba(37,99,235,0.2)' } : SEVERITY_META[chip.key];
          const Icon = chip.icon;
          return (
            <Box key={chip.key} onClick={() => setFilter(chip.key)}
              sx={{ display: 'flex', alignItems: 'center', gap: 0.8, px: 1.5, py: 0.8, borderRadius: 2, cursor: 'pointer', transition: 'all 0.15s',
                bgcolor: active ? meta.bg : 'rgba(255,255,255,0.03)', border: active ? `1px solid ${meta.border}` : '1px solid transparent',
                color: active ? meta.color : 'text.secondary', '&:hover': { bgcolor: meta.bg, border: `1px solid ${meta.border}` } }}>
              {Icon && <Icon sx={{ fontSize: 14 }} />}
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 600 }}>{chip.label}</Typography>
              <Chip label={counts[chip.key]} size="small" sx={{ height: 18, minWidth: 20, fontSize: '0.6rem', fontWeight: 700, bgcolor: active ? meta.color : 'rgba(255,255,255,0.08)', color: active ? '#fff' : 'text.secondary' }} />
            </Box>
          );
        })}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {filtered.map((alert, i) => {
          const meta = SEVERITY_META[alert.severity] || SEVERITY_META.low;
          const Icon = SEVERITY_ICONS[alert.severity] || InfoOutlinedIcon;
          return (
            <Box key={alert.id || i} onClick={() => setSelected(alert)}
              sx={{ p: 2, borderRadius: 2, cursor: 'pointer', transition: 'all 0.15s',
                bgcolor: meta.bg, border: `1px solid ${meta.border}`,
                '&:hover': { opacity: 0.85 } }}>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Icon sx={{ fontSize: 18, color: meta.color, mt: 0.3, flexShrink: 0 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3, flexWrap: 'wrap' }}>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: meta.color, textTransform: 'uppercase' }}>{meta.label}</Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>{alert.date}</Typography>
                    {alert.type && <Chip label={alert.type} size="small" sx={{ height: 18, fontSize: '0.6rem', bgcolor: 'rgba(255,255,255,0.4)', color: 'text.secondary' }} />}
                  </Box>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>{alert.title}</Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', mt: 0.3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {alert.description}
                  </Typography>
                </Box>
                <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled', flexShrink: 0, mt: 0.5 }} />
              </Box>
            </Box>
          );
        })}
        {filtered.length === 0 && (
          <Typography sx={{ textAlign: 'center', py: 4, color: 'text.secondary', fontSize: '0.82rem' }}>Aucune alerte pour ce filtre</Typography>
        )}
      </Box>

      {selected && (
        <Box className="modal-overlay" onClick={() => setSelected(null)}
          sx={{ position: 'fixed', inset: 0, zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, bgcolor: 'rgba(0,0,0,0.4)' }}>
          <Box onClick={(e) => e.stopPropagation()}
            sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 8, maxWidth: 520, width: '100%', p: 3, position: 'relative', animation: 'fadeIn 0.25s ease-out' }}>
            <CloseIcon onClick={() => setSelected(null)}
              sx={{ position: 'absolute', top: 12, right: 12, fontSize: 18, color: 'text.disabled', cursor: 'pointer', '&:hover': { color: 'text.primary' } }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: SEVERITY_META[selected.severity]?.color || '#3b82f6' }} />
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>{selected.title}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip label={SEVERITY_META[selected.severity]?.label || 'FAIBLE'} size="small"
                sx={{ fontWeight: 700, fontSize: '0.6rem', bgcolor: SEVERITY_META[selected.severity]?.bg, color: SEVERITY_META[selected.severity]?.color }} />
              <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>{selected.date}</Typography>
              {selected.type && <Chip label={selected.type} size="small" sx={{ fontSize: '0.6rem', bgcolor: 'rgba(255,255,255,0.05)', color: 'text.secondary' }} />}
            </Box>
            <Typography sx={{ fontSize: '0.82rem', lineHeight: 1.6 }}>{selected.description}</Typography>
            {selected.impact && (
              <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.12)' }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#2563eb', mb: 0.3 }}>Impact</Typography>
                <Typography sx={{ fontSize: '0.78rem' }}>{selected.impact}</Typography>
              </Box>
            )}
            {selected.source && (
              <Typography sx={{ mt: 1.5, fontSize: '0.65rem', color: 'text.disabled' }}>Source : {selected.source}</Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
