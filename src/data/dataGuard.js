// ═══════════════════════════════════════════════════════════════════
//  DATA GUARD — Validates & sanitizes all data to prevent crashes
//  Every function returns safe defaults if input is malformed.
// ═══════════════════════════════════════════════════════════════════

const num = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const str = (v, fallback = '') => (typeof v === 'string' ? v : fallback);

const bool = (v, fallback = false) => (typeof v === 'boolean' ? v : fallback);

// ─── TOP PRODUITS ───
export function guardTopProduits(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map((p) => ({
    id: str(p.id, str(p.product_id, 'unknown')),
    name: str(p.name, str(p.product_name, str(p.product_id, 'Produit'))),
    revenue: num(p.revenue),
    category: str(p.category, 'Général'),
    orders: num(p.orders, 0),
    avg_price: num(p.avg_price, 0),
    reorder_rate: num(p.reorder_rate, 0),
    stock: num(p.stock, 0),
  }));
}

// ─── RECOMMENDATIONS ───
export function guardRecommendations(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map((r) => ({
    user_id: str(r.user_id, `Produit ${r.product_id || ''}`),
    product_name: str(r.product_name, str(r.product_id, 'Produit')),
    confidence: num(r.confidence, num(r.score, 0)),
    is_reordered: bool(r.is_reordered, num(r.taux_reachat, 0) > 0.5),
    category: str(r.category, 'Général'),
    price: num(r.price, 0),
  }));
}

// ─── METRICS ───
export function guardMetrics(obj) {
  if (!obj || typeof obj !== 'object') return { accuracy: 0, precision: 0, recall: 0, f1_score: 0 };
  return {
    accuracy: num(obj.accuracy),
    precision: num(obj.precision),
    recall: num(obj.recall),
    f1_score: num(obj.f1_score),
  };
}

// ─── CONFUSION MATRIX ───
export function guardConfusion(obj) {
  if (!obj || typeof obj !== 'object') return { true_positives: 0, false_positives: 0, true_negatives: 0, false_negatives: 0 };

  if (Array.isArray(obj.matrix) && obj.matrix.length === 2) {
    const m = obj.matrix;
    return {
      true_negatives: num(m[0]?.[0], 0),
      false_positives: num(m[0]?.[1], 0),
      false_negatives: num(m[1]?.[0], 0),
      true_positives: num(m[1]?.[1], 0),
    };
  }

  return {
    true_positives: num(obj.true_positives, 0),
    false_positives: num(obj.false_positives, 0),
    true_negatives: num(obj.true_negatives, 0),
    false_negatives: num(obj.false_negatives, 0),
  };
}

// ─── FEATURE IMPORTANCE ───
export function guardFeatures(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map((f) => ({
    feature: str(f.feature, 'Feature'),
    importance: num(f.importance, 0),
  }));
}

// ─── DASHBOARD STATS ───
export function guardStats(obj) {
  if (!obj || typeof obj !== 'object') return {};
  const out = {};
  const keys = ['total_revenue', 'total_orders', 'total_products', 'active_users',
    'avg_order_value', 'reorder_rate', 'recommendations_generated', 'avg_confidence',
    'revenue_growth', 'orders_growth'];
  keys.forEach((k) => { out[k] = num(obj[k], 0); });
  return out;
}

// ─── REVENUE TREND ───
export function guardTrend(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map((t) => ({
    month: str(t.month, ''),
    revenue: num(t.revenue, 0),
    orders: num(t.orders, 0),
    prev_year: num(t.prev_year, 0),
  }));
}

// ─── CATEGORY STATS ───
export function guardCategories(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map((c) => ({
    name: str(c.name, ''),
    revenue: num(c.revenue, 0),
    products: num(c.products, 0),
    orders: num(c.orders, 0),
    percentage: num(c.percentage, 0),
    growth: num(c.growth, 0),
  }));
}

// ─── ANOMALIES ───
export function guardAnomalies(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map((a) => ({
    id: str(a.id),
    type: str(a.type, 'Alerte'),
    severity: str(a.severity, 'low'),
    title: str(a.title, 'Alerte'),
    description: str(a.description, ''),
    date: str(a.date, ''),
    impact: str(a.impact, ''),
    source: str(a.source, ''),
  }));
}

// ─── BASKETS ───
export function guardBaskets(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map((b) => ({
    order_id: str(b.order_id),
    products: Array.isArray(b.products) ? b.products.map((p) => str(p)).filter(Boolean) : [],
    total: num(b.total, 0),
  }));
}

// ─── PRODUCT PAIRS ───
export function guardPairs(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map((p) => ({
    product_a: str(p.product_a),
    product_b: str(p.product_b),
    count: num(p.count, 0),
  }));
}

// ─── FEATURES RAW ───
export function guardFeaturesRaw(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map((f) => ({
    product_id: str(f.product_id),
    total_apparitions: num(f.total_apparitions, 0),
    total_reordered: num(f.total_reordered, 0),
    taux_reordered: num(f.taux_reordered, 0),
    avg_position: num(f.avg_position, 0),
  }));
}

// ─── TRANSACTIONS STATS ───
export function guardTransactions(obj) {
  if (!obj || typeof obj !== 'object') return { total_transactions: 0, total_revenue: 0, delivered: 0, products: 0, avg_per_order: 0, status_breakdown: {} };
  const sb = obj.status_breakdown;
  return {
    total_transactions: num(obj.total_transactions, 0),
    total_revenue: num(obj.total_revenue, 0),
    delivered: num(obj.delivered, 0),
    products: num(obj.products, 0),
    avg_per_order: num(obj.avg_per_order, 1),
    status_breakdown: sb && typeof sb === 'object' ? {
      delivered: num(sb.delivered, 0),
      shipped: num(sb.shipped, 0),
      processing: num(sb.processing, 0),
      cancelled: num(sb.cancelled, 0),
    } : {},
  };
}
