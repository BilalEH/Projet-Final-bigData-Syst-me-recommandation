import { createContext, useContext, useMemo, useState } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItemButton,
  ListItemIcon, ListItemText, IconButton, Badge, Autocomplete, TextField,
  Menu, MenuItem, Snackbar, Alert, SpeedDial, SpeedDialAction, Tooltip,
  InputAdornment, Card, CardContent, Chip, LinearProgress, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Grid,
} from '@mui/material';
import {
  LayoutDashboard, BarChart3, Cpu, MessageCircle, ShoppingBag, Shield,
  Menu as MenuIcon, Download, Upload, RefreshCw, FileText, Search, TrendingUp,
  TrendingDown, Activity, Target, CheckCircle, AlertTriangle, Info, Lightbulb,
} from 'lucide-react';

import TopProductsChart from './TopProductsChart';
import ModelMetricsCard from './ModelMetricsCard';
import FeatureImportanceChart from './FeatureImportanceChart';
import ConfusionMatrix from './ConfusionMatrix';
import RecommendationTable from './RecommendationTable';
import AnomalyAlerts from './AnomalyAlerts';
import ProductPairs from './ProductPairs';
import BasketStats from './BasketStats';
import RevenueTrendChart from './RevenueTrendChart';
import CategoryPieChart from './CategoryPieChart';
import StatsCards from './StatsCards';
import {
  topProduits, recommendations, mlMetrics, confusionMatrix, featureImportance,
  dashboardStats, revenueTrend, categoryStats, anomalies,
  baskets, productPairs, featuresRaw, transactionsStats,
} from '../data/dataLoader';

export const AppLayoutContext = createContext();

const PAGES = [
  { id: 'dashboard', label: 'Accueil', icon: LayoutDashboard },
  { id: 'products', label: 'Top Produits', icon: BarChart3 },
  { id: 'model', label: 'Modèle ML', icon: Cpu },
  { id: 'baskets', label: 'Paniers', icon: ShoppingBag },
  { id: 'anomalies', label: 'Sécurité', icon: Shield },
  { id: 'recommend', label: 'Recommandations', icon: MessageCircle },
];

const DRAWER_WIDTH = 240;

export default function AppLayoutRoot() {
  const { page, setPage, search, setSearch } = useContext(AppLayoutContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const criticalCount = anomalies.filter((a) => a.severity === 'high').length;

  const showSnack = (message, severity = 'success') => setSnack({ open: true, message, severity });

  const handleExport = () => {
    const data = { topProduits, recommendations, mlMetrics, confusionMatrix, featureImportance, dashboardStats, revenueTrend, categoryStats, anomalies, baskets, productPairs, featuresRaw, transactionsStats };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'dashboard-data.json'; a.click();
    URL.revokeObjectURL(url);
    showSnack('Données exportées avec succès');
    setAnchorEl(null);
  };

  const pageData = PAGES.find((p) => p.id === page);

  const sidebar = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, minHeight: 64, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#2563eb' }}>Projet Big Data</Typography>
          <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', mt: 0.3, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            Bilal, Ilyas, Ahmed, Anas
          </Typography>
        </Box>
      </Box>
      <Typography sx={{ px: 3, pt: 2, pb: 0.8, fontSize: '0.6rem', fontWeight: 700, color: '#6b7280', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        Navigation
      </Typography>
      <List sx={{ flex: 1, px: 1.5, overflow: 'auto', py: 0.5 }}>
        {PAGES.map((p) => {
          const active = page === p.id;
          const Icon = p.icon;
          return (
            <ListItemButton key={p.id} selected={active}
              onClick={() => { setPage(p.id); setMobileOpen(false); }}
              sx={{ borderRadius: 2, mb: 0.2, px: 1.5, py: 1.1, color: active ? '#2563eb' : '#6b7280',
                '&:hover': { background: 'rgba(255,255,255,0.04)' },
                '&.Mui-selected': { background: 'rgba(37,99,235,0.1)', '&:hover': { background: 'rgba(37,99,235,0.15)' } } }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                {p.id === 'anomalies' ? (
                  <Badge badgeContent={criticalCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 9, fontWeight: 700, minWidth: 16, height: 16 } }}>
                    <Icon size={18} color={active ? '#2563eb' : '#6b7280'} />
                  </Badge>
                ) : <Icon size={18} color={active ? '#2563eb' : '#6b7280'} />}
              </ListItemIcon>
              <ListItemText primary={p.label} slotProps={{ primary: { fontSize: '0.82rem', fontWeight: active ? 700 : 500 } }} />
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider', px: 2, py: 1.2 }}>
        <Typography sx={{ fontSize: '0.55rem', color: '#6b7280', textAlign: 'center', lineHeight: 1.3 }}>
          Projet Big Data<br />Bilal · Ilyas · Ahmed · Anas
        </Typography>
      </Box>
    </Box>
  );

  const searchItems = useMemo(() => {
    const items = [];
    topProduits.forEach((p) => items.push({ label: `${p.name} — ${p.revenue.toLocaleString('fr-FR')} MAD`, page: 'products', search: p.name }));
    recommendations.forEach((r) => items.push({ label: `${r.product_name} → ${r.user_id}`, page: 'recommend', search: r.product_name }));
    return items;
  }, []);

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        const topProduct = topProduits.sort((a, b) => b.revenue - a.revenue)[0];
        const lowStockCount = topProduits.filter((p) => p.stock < 100).length;
        const revenueGrowth = dashboardStats?.revenue_growth;
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Card>
              <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Lightbulb size={20} color="#2563eb" />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>Bonjour Manager,</Typography>
                <Chip icon={<TrendingUp size={14} />} label={`Meilleur produit : ${topProduct?.name || '—'}`} variant="outlined" size="small" sx={{ fontWeight: 600, fontSize: '0.7rem', maxWidth: 300, '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' } }} />
                {lowStockCount > 0 && <Chip icon={<AlertTriangle size={14} />} label={`${lowStockCount} produits en rupture de stock`} color="warning" size="small" sx={{ fontWeight: 600, fontSize: '0.7rem' }} />}
                <Chip icon={<Shield size={14} />} label={`${criticalCount} alertes critiques`} color={criticalCount > 0 ? 'error' : 'default'} size="small" sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
                {revenueGrowth > 0 && <Chip label={`Croissance CA : +${revenueGrowth}%`} sx={{ fontWeight: 600, fontSize: '0.7rem', bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981' }} />}
                <Typography variant="body2" sx={{ fontSize: '0.65rem', color: 'text.secondary', ml: 'auto' }}>
                  {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </Typography>
              </CardContent>
            </Card>

            <StatsCards stats={dashboardStats} />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '7fr 5fr' }, gap: 2.5 }}>
              <RevenueTrendChart data={revenueTrend} />
              <CategoryPieChart data={categoryStats} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Activity size={20} color="#2563eb" /> Métriques du Modèle Random Forest
              </Typography>
              <ModelMetricsCard metrics={mlMetrics} />
            </Box>
          </Box>
        );
      case 'products':
        return <TopProductsChart data={topProduits} />;

      case 'model':
        return renderModelPage();

      case 'baskets':
        return renderBasketsPage();

      case 'anomalies':
        return <AnomalyAlerts data={anomalies} />;

      case 'recommend':
        return renderRecommendPage();

      default:
        return null;
    }
  };

  function renderModelPage() {
    const totalTest = (confusionMatrix.true_positives + confusionMatrix.false_positives + confusionMatrix.true_negatives + confusionMatrix.false_negatives) || 1;
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Typography variant="h5">Évaluation du Modèle Random Forest</Typography>

        <ModelMetricsCard metrics={mlMetrics} detailed />

        {/* Insights for manager */}
        <Card>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Lightbulb size={20} color="#2563eb" />
              <Typography variant="h6">Interprétation pour le Manager</Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                <CheckCircle size={18} color="#10b981" style={{ marginBottom: 6 }} />
                <Typography sx={{ fontWeight: 600, fontSize: '0.82rem' }}>Fiabilité : {(mlMetrics.accuracy * 100).toFixed(0)}%</Typography>
                <Typography variant="body2" sx={{ fontSize: '0.7rem', mt: 0.3 }}>Le modèle est fiable dans {((mlMetrics.accuracy * 100)).toFixed(0)}% des cas. Sur {totalTest.toLocaleString('fr-FR')} produits testés, il a correctement classé {((confusionMatrix.true_positives + confusionMatrix.true_negatives)).toLocaleString('fr-FR')}.</Typography>
              </Box>
              <Box sx={{ p: 1.5, borderRadius: 2, background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)' }}>
                <Target size={18} color="#2563eb" style={{ marginBottom: 6 }} />
                <Typography sx={{ fontWeight: 600, fontSize: '0.82rem' }}>Pertinence : {(mlMetrics.precision * 100).toFixed(0)}%</Typography>
                <Typography variant="body2" sx={{ fontSize: '0.7rem', mt: 0.3 }}>Quand le modèle recommande un produit, il a raison {((mlMetrics.precision * 100)).toFixed(0)}% du temps. Faible taux de fausses recommandations ({confusionMatrix.false_positives.toLocaleString('fr-FR')} FP).</Typography>
              </Box>
              <Box sx={{ p: 1.5, borderRadius: 2, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
                <Activity size={18} color="#6366f1" style={{ marginBottom: 6 }} />
                <Typography sx={{ fontWeight: 600, fontSize: '0.82rem' }}>Couverture : {(mlMetrics.recall * 100).toFixed(0)}%</Typography>
                <Typography variant="body2" sx={{ fontSize: '0.7rem', mt: 0.3 }}>Le modèle détecte {((mlMetrics.recall * 100)).toFixed(0)}% des produits réellement recommandables. {confusionMatrix.false_negatives.toLocaleString('fr-FR')} produits auraient dû être recommandés mais ne l'ont pas été.</Typography>
              </Box>
              <Box sx={{ p: 1.5, borderRadius: 2, background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
                <TrendingUp size={18} color="#8b5cf6" style={{ marginBottom: 6 }} />
                <Typography sx={{ fontWeight: 600, fontSize: '0.82rem' }}>F1-Score : {(mlMetrics.f1_score * 100).toFixed(0)}%</Typography>
                <Typography variant="body2" sx={{ fontSize: '0.7rem', mt: 0.3 }}>Score global de performance. Un score de {((mlMetrics.f1_score * 100)).toFixed(0)}% indique un bon équilibre entre pertinence des recommandations et couverture des produits.</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2.5 }}>
          <FeatureImportanceChart data={featureImportance} />
          <ConfusionMatrix data={confusionMatrix} />
        </Box>

        <Card>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Info size={20} color="#06b6d4" />
              <Typography variant="h6">Décision Manager — Que faire ?</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { action: 'Améliorer la couverture (Recall)', desc: 'Ajouter plus de données d\'entraînement et diversifier les features pour réduire les faux négatifs.', impact: 'Augmentation du nombre de recommandations pertinentes', priority: 'Haute' },
                { action: 'Maintenir la pertinence (Precision)', desc: 'Le modèle est déjà bon pour éviter les fausses recommandations. Continuer à monitorer.', impact: 'Confiance utilisateur préservée', priority: 'Moyenne' },
                { action: 'Ré-entraînement périodique', desc: 'Planifier un ré-entraînement mensuel pour adapter le modèle aux nouveaux patterns d\'achat.', impact: 'Maintien des performances dans le temps', priority: 'Haute' },
              ].map((item) => (
                <Box key={item.action} sx={{ display: 'flex', gap: 1.5, p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.02)' }}>
                  <Chip label={item.priority} size="small" color={item.priority === 'Haute' ? 'error' : 'warning'} sx={{ minWidth: 60, fontWeight: 700 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.82rem' }}>{item.action}</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.72rem' }}>{item.desc}</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.65rem', color: '#10b981', mt: 0.2 }}>Impact : {item.impact}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  function renderBasketsPage() {
    const status = transactionsStats?.status_breakdown || {};
    const totalTx = transactionsStats?.total_transactions || 0;
    const sortedFeatures = [...featuresRaw].sort((a, b) => b.taux_reordered - a.taux_reordered).slice(0, 10);
    const topPair = productPairs.sort((a, b) => b.count - a.count)[0];
    const highReorderCount = featuresRaw.filter((f) => f.taux_reordered >= 0.7).length;

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Typography variant="h5">Analyse des Paniers & Associations</Typography>

        {/* Manager Insight */}
        <Card>
          <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Lightbulb size={18} color="#2563eb" />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>Opportunités de vente croisée</Typography>
            {topPair && <Chip label={`Meilleure paire : ${topPair.product_a} + ${topPair.product_b} (${topPair.count}x)`} variant="outlined" size="small" sx={{ fontWeight: 600, fontSize: '0.7rem', maxWidth: 400, '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' } }} />}
            <Chip label={`${highReorderCount} produits à fort ré-achat (≥70%)`} sx={{ fontWeight: 600, fontSize: '0.7rem', bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981' }} />
            <Chip label={`Taux livraison : ${((status.delivered || 0) / totalTx * 100).toFixed(1)}%`} variant="outlined" size="small" sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
          </CardContent>
        </Card>

        {/* Transaction KPIs */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(4,1fr)' }, gap: 1.5 }}>
          {[
            { label: 'Transactions Total', value: totalTx.toLocaleString('fr-FR'), color: '#2563eb', icon: ShoppingBag },
            { label: 'Livrées', value: (status.delivered || 0).toLocaleString('fr-FR'), color: '#10b981', icon: CheckCircle },
            { label: 'En cours', value: ((status.shipped || 0) + (status.processing || 0)).toLocaleString('fr-FR'), color: '#6366f1', icon: TrendingUp },
            { label: 'Annulées', value: (status.cancelled || 0).toLocaleString('fr-FR'), color: '#ef4444', icon: TrendingDown },
          ].map((s) => (
            <Box key={s.label} sx={{ p: 1.5, borderRadius: 2, background: 'background.paper', border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
              <s.icon size={16} color={s.color} style={{ marginBottom: 4 }} />
              <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'monospace', color: s.color }}>{s.value}</Typography>
              <Typography variant="body2" sx={{ fontSize: '0.65rem' }}>{s.label}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2.5 }}>
          <BasketStats baskets={baskets} transactions={transactionsStats} />
          <ProductPairs pairs={productPairs} products={topProduits} />
        </Box>

        {/* Features Table - Top Reordered Products */}
        <Card>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Activity size={20} color="#2563eb" />
              <Typography variant="h6">Top Produits par Taux de Ré-achat — Features ML</Typography>
            </Box>
            <Box sx={{ overflowX: 'auto' }}>
              <TableContainer component={Paper} sx={{ background: 'transparent', boxShadow: 'none' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {['#', 'Produit', 'Apparitions', 'Ré-achats', 'Taux Ré-achat', 'Position Moy.', 'Recommandation'].map((h) => (
                        <TableCell key={h} sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderColor: 'divider', py: 1 }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedFeatures.map((f, i) => {
                      const product = topProduits.find((p) => p.id === f.product_id);
                      return (
                        <TableRow key={f.product_id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' }, '& td': { borderColor: 'divider', py: 0.8 } }}>
                          <TableCell sx={{ fontSize: '0.7rem', color: '#6b7280', fontFamily: 'monospace' }}>{i + 1}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{product?.name || f.product_id}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>{f.total_apparitions}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>{f.total_reordered}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ flex: 1, maxWidth: 80, height: 5, bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                                <Box sx={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #2563eb, #1d4ed8)', width: `${(f.taux_reordered * 100)}%` }} />
                              </Box>
                              <Typography sx={{ fontFamily: 'monospace', fontSize: '0.7rem', fontWeight: 700, color: f.taux_reordered >= 0.7 ? '#10b981' : '#2563eb' }}>
                                {(f.taux_reordered * 100).toFixed(0)}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#9ca3af' }}>{f.avg_position.toFixed(1)}</TableCell>
                          <TableCell>
                            <Chip label={f.taux_reordered >= 0.7 ? 'À recommander' : 'Standard'} size="small"
                              color={f.taux_reordered >= 0.7 ? 'success' : 'default'} variant="outlined"
                              sx={{ fontWeight: 600, fontSize: '0.6rem' }} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Typography variant="body2" sx={{ mt: 1.5, fontSize: '0.7rem', textAlign: 'center', color: '#6b7280' }}>
              {featuresRaw.length} produits analysés — Les produits avec un taux de ré-achat ≥ 70% sont prioritaires pour les recommandations
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  function renderRecommendPage() {
    const recs = recommendations || [];
    const avgConf = recs.length ? recs.reduce((s, r) => s + r.confidence, 0) / recs.length : 0;
    const highConf = recs.filter((r) => r.confidence >= 0.8).length;
    const reorderCount = recs.filter((r) => r.is_reordered).length;
    const catMap = {};
    recs.forEach((r) => { catMap[r.category] = (catMap[r.category] || 0) + 1; });
    const topCategories = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const topCat = topCategories[0];
    const bestRec = recs.sort((a, b) => b.confidence - a.confidence)[0];

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Typography variant="h5">Recommandations & Prédictions Clients</Typography>

        {/* Manager Insight */}
        <Card>
          <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Lightbulb size={18} color="#2563eb" />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>Analyse recommandations</Typography>
            {bestRec && <Chip label={`Meilleure recommandation : ${bestRec.product_name} → ${bestRec.user_id}`} variant="outlined" size="small" sx={{ fontWeight: 600, fontSize: '0.7rem', maxWidth: 350, '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' } }} />}
            {topCat && <Chip label={`Catégorie phare : ${topCat[0]} (${topCat[1]} recommandations)`} sx={{ fontWeight: 600, fontSize: '0.7rem', bgcolor: 'rgba(37,99,235,0.1)', color: '#2563eb' }} />}
            <Chip label={`${highConf} recommandations haute confiance (≥80%)`} sx={{ fontWeight: 600, fontSize: '0.7rem', bgcolor: 'rgba(99,102,241,0.1)', color: '#6366f1' }} />
            <Chip label={`Taux ré-achat : ${(reorderCount / recs.length * 100).toFixed(0)}%`} variant="outlined" size="small" sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
          </CardContent>
        </Card>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(4,1fr)' }, gap: 1.5 }}>
          {[
            { label: 'Recommandations', value: recs.length, color: '#2563eb', icon: MessageCircle },
            { label: 'Ré-achats', value: recs.filter((r) => r.is_reordered).length, color: '#10b981', icon: CheckCircle },
            { label: 'Haute Confiance (≥80%)', value: highConf, color: '#6366f1', icon: Target },
            { label: 'Confiance Moyenne', value: `${(avgConf * 100).toFixed(0)}%`, color: '#2563eb', icon: TrendingUp },
          ].map((s) => (
            <Box key={s.label} sx={{ p: 1.5, borderRadius: 2, background: 'background.paper', border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
              <s.icon size={16} color={s.color} style={{ marginBottom: 4 }} />
              <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'monospace', color: s.color }}>{s.value}</Typography>
              <Typography variant="body2" sx={{ fontSize: '0.65rem' }}>{s.label}</Typography>
            </Box>
          ))}
        </Box>

        {/* Top categories recommended */}
        <Card>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <BarChart3 size={20} color="#000000" />
              <Typography variant="h6">Top Catégories Recommandées</Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' }, gap: 1.5 }}>
              {topCategories.map(([cat, count], i) => {
                const pct = (count / recs.length * 100);
                return (
                  <Box key={cat} sx={{ textAlign: 'center', p: 1.5, borderRadius: 2, background: `rgba(37,99,235,${0.04 + i * 0.02})`, border: '1px solid rgba(37,99,235,0.1)' }}>
                    <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: '#2563eb', fontFamily: 'monospace' }}>{count}</Typography>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 600 }}>{cat}</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.6rem' }}>{pct.toFixed(1)}% des recs</Typography>
                    <LinearProgress variant="determinate" value={pct} sx={{ mt: 0.5, height: 3, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #2563eb, #1d4ed8)' } }} />
                  </Box>
                );
              })}
            </Box>
          </CardContent>
        </Card>

        <RecommendationTable data={recommendations} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
        ModalProps={{ keepMounted: true }}>
        {sidebar}
      </Drawer>
      <Drawer variant="permanent" open
        sx={{ display: { xs: 'none', md: 'block' }, flexShrink: 0, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}>
        {sidebar}
      </Drawer>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, ml: { md: `${DRAWER_WIDTH}px` }, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` } }}>
        <AppBar position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, width: '100%' , background:"#2563eb" }}>
          <Toolbar sx={{ gap: 1.5, px: { xs: 1.5, md: 2.5 } }}>
            <IconButton edge="start" sx={{ display: { md: 'none' } }} onClick={() => setMobileOpen(true)}>
              <MenuIcon size={20} />
            </IconButton>
            <Typography variant="h6" sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#f3f4f6', whiteSpace: 'nowrap' }}>
              {pageData?.label || 'Dashboard'}
            </Typography>
            <Autocomplete size="small" options={searchItems} getOptionLabel={(o) => o.label}
              sx={{ flex: '1 1 280px', maxWidth: 400, ml: { xs: 0, md: 2 } }}
              onChange={(_, v) => { if (v) { setPage(v.page); setSearch(v.search); } }}
              renderInput={(params) => {
                const { slotProps: sp, ...rest } = params;
                return (
                  <TextField {...rest} placeholder="Rechercher produit, utilisateur..."
                    slotProps={{
                      ...sp,
                      input: { ...sp?.input, startAdornment: <InputAdornment position="start"><Search size={16} /></InputAdornment> },
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { background: 'rgba(255, 255, 255, 0.7)', borderRadius: 1, fontSize: '0.85rem', '& fieldset': { borderColor: 'transparent' }, '&:hover fieldset': { borderColor: 'rgba(37,99,235,0.3)' }, '&.Mui-focused fieldset': { borderColor: '#2563eb' } } }} />
                );
              }} />
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5}}>
              <Tooltip title="Actions">
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}><Download size={18} color="#ffffff" /></IconButton>
              </Tooltip>
            </Box>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
              slotProps={{ paper: { sx: { borderRadius: 2.5, mt: 0.5, minWidth: 200 } } }}>
              <MenuItem onClick={handleExport} sx={{ gap: 1.5, fontSize: '0.85rem' }}><Download size={16} /> Exporter JSON</MenuItem>
              <MenuItem onClick={() => { setAnchorEl(null); showSnack('Export CSV en cours...', 'info'); }} sx={{ gap: 1.5, fontSize: '0.85rem' }}><FileText size={16} /> Exporter CSV</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ flex: 1, overflow: 'auto', p: { xs: 1.5, md: 2.5, lg: 3 } }}>
          {renderPage()}
        </Box>
      </Box>
      <SpeedDial ariaLabel="Actions rapides"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        icon={<Upload size={20} />}
        FabProps={{ size: 'small', sx: { background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', '&:hover': { background: 'linear-gradient(135deg, #1d4ed8, #1e40af)' } } }}>
        <SpeedDialAction icon={<Download size={18} />} onClick={handleExport} />
        <SpeedDialAction icon={<RefreshCw size={18} />} onClick={() => showSnack('Données rafraîchies')} />
        <SpeedDialAction icon={<FileText size={18} />} onClick={() => showSnack('Rapport généré', 'info')} />
      </SpeedDial>
      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} variant="filled" sx={{ borderRadius: 2, fontWeight: 600 }}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}
