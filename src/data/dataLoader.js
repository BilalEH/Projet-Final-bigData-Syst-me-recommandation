// ═══════════════════════════════════════════════════════════════════
//  DATA LOADER — Central data import with auto-validation
//  All exports are sanitized → zero crash risk from malformed data.
// ═══════════════════════════════════════════════════════════════════
//  🔧 To swap mock ↔ real: open source.js and change USE_REAL_DATA
// ═══════════════════════════════════════════════════════════════════

import { USE_REAL_DATA } from './source';
import {
  guardTopProduits, guardRecommendations, guardMetrics, guardConfusion,
  guardFeatures, guardStats, guardTrend, guardCategories, guardAnomalies,
  guardBaskets, guardPairs, guardFeaturesRaw, guardTransactions,
} from './dataGuard';

// Mock data
import _mTop from './mock/top_produits.json';
import _mRec from './mock/recommendations_ml.json';
import _mMet from './mock/ml_metrics.json';
import _mConf from './mock/confusion_matrix.json';
import _mFeat from './mock/feature_importance.json';
import _mStats from './mock/dashboard_stats.json';
import _mTrend from './mock/revenue_trend.json';
import _mCat from './mock/category_stats.json';
import _mAnom from './mock/anomalies.json';
import _mBaskets from './mock/baskets.json';
import _mPairs from './mock/product_pairs.json';
import _mFeatRaw from './mock/features_raw.json';
import _mTx from './mock/transactions_stats.json';

// Real data
import _rTop from './real/top_produits.json';
import _rRec from './real/recommendations_ml.json';
import _rMet from './real/ml_metrics.json';
import _rConf from './real/confusion_matrix.json';
import _rFeat from './real/feature_importance.json';
import _rStats from './real/dashboard_stats.json';
import _rTrend from './real/revenue_trend.json';
import _rCat from './real/category_stats.json';
import _rAnom from './real/anomalies.json';
import _rBaskets from './real/baskets.json';
import _rPairs from './real/product_pairs.json';
import _rFeatRaw from './real/features_raw.json';
import _rTx from './real/transactions_stats.json';

// Pick mock or real, then validate
const pick = (mock, real) => (USE_REAL_DATA ? real : mock);
const val = (mock, real, guardFn) => guardFn(pick(mock, real));

export const topProduits = val(_mTop, _rTop, guardTopProduits);
export const recommendations = val(_mRec, _rRec, guardRecommendations);
export const mlMetrics = val(_mMet, _rMet, guardMetrics);
export const confusionMatrix = val(_mConf, _rConf, guardConfusion);
export const featureImportance = val(_mFeat, _rFeat, guardFeatures);
export const dashboardStats = val(_mStats, _rStats, guardStats);
export const revenueTrend = val(_mTrend, _rTrend, guardTrend);
export const categoryStats = val(_mCat, _rCat, guardCategories);
export const anomalies = val(_mAnom, _rAnom, guardAnomalies);
export const baskets = val(_mBaskets, _rBaskets, guardBaskets);
export const productPairs = val(_mPairs, _rPairs, guardPairs);
export const featuresRaw = val(_mFeatRaw, _rFeatRaw, guardFeaturesRaw);
export const transactionsStats = val(_mTx, _rTx, guardTransactions);
