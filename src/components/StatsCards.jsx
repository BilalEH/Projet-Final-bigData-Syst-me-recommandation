import { Box, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import RepeatIcon from '@mui/icons-material/Repeat';
import MessageIcon from '@mui/icons-material/Message';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

const CARDS = [
  { key: 'total_revenue', label: "Chiffre d'Affaires", icon: AccountBalanceWalletIcon, suffix: ' MAD', decimals: 0, growthKey: 'revenue_growth' },
  { key: 'total_orders', label: 'Commandes', icon: ShoppingCartIcon, suffix: '', decimals: 0, growthKey: 'orders_growth' },
  { key: 'total_products', label: 'Produits', icon: InventoryIcon, suffix: '', decimals: 0, growthKey: null },
  { key: 'active_users', label: 'Clients Actifs', icon: PeopleIcon, suffix: '', decimals: 0, growthKey: null },
  { key: 'avg_order_value', label: 'Panier Moyen', icon: AccountBalanceWalletIcon, suffix: ' MAD', decimals: 2, growthKey: null },
  { key: 'reorder_rate', label: 'Taux de Ré-achat', icon: RepeatIcon, suffix: '%', decimals: 0, growthKey: null, multiplier: 100 },
  { key: 'recommendations_generated', label: 'Recommandations', icon: MessageIcon, suffix: '', decimals: 0, growthKey: null },
  { key: 'avg_confidence', label: 'Confiance Moy.', icon: TrackChangesIcon, suffix: '%', decimals: 0, growthKey: null, multiplier: 100 },
];

export default function StatsCards({ stats }) {
  if (!stats) return null;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
      {CARDS.map((card) => {
        const val = stats[card.key];
        if (val === undefined || val === null) return null;
        const Icon = card.icon;
        const displayVal = card.multiplier ? (val * card.multiplier).toFixed(card.decimals) : val.toLocaleString('fr-FR', { minimumFractionDigits: card.decimals, maximumFractionDigits: card.decimals });
        const growth = card.growthKey ? stats[card.growthKey] : null;
        const isPositive = growth !== null ? growth >= 0 : null;

        return (
          <Box key={card.key} sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 2, border: '1px solid', borderColor: 'divider', animation: 'fadeIn 0.4s ease-out forwards' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: 'text.secondary', textTransform: 'capitalize' }}>
                {card.label}
              </Typography>
              <Icon sx={{ fontSize: 16, color: growth !== null ? (isPositive ? '#10b981' : '#ef4444') : 'text.disabled' }} />
            </Box>
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'monospace' }}>
              {displayVal}{card.suffix}
            </Typography>
            {growth !== null && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, mt: 0.5 }}>
                {isPositive ? <TrendingUpIcon sx={{ fontSize: 12, color: '#10b981' }} /> : <TrendingDownIcon sx={{ fontSize: 12, color: '#ef4444' }} />}
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: isPositive ? '#10b981' : '#ef4444' }}>
                  {isPositive ? '+' : ''}{growth}% vs mois dernier
                </Typography>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
