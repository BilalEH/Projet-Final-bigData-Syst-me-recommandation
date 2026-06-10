# 🔧 Guide d'intégration des données réelles du pipeline

## Comment remplacer les mock data par les vraies données

### Prérequis

Ahmed doit avoir terminé son Module 3 et fourni les 9 fichiers CSV suivants :

| # | Fichier | Produit par |
|---|---------|-------------|
| 1 | `revenue_by_product.csv` | `reducer_revenue.py` |
| 2 | `ml_metrics.csv` | `evaluate_model.py` |
| 3 | `confusion_matrix.csv` | `evaluate_model.py` |
| 4 | `feature_importance.csv` | `evaluate_model.py` |
| 5 | `recommendations.csv` | `generate_recommendations.py` |
| 6 | `baskets.csv` | `reducer_basket.py` |
| 7 | `product_pairs.csv` | `reducer_pairs.py` |
| 8 | `product_features_raw.csv` | `reducer_product_features.py` |
| 9 | `transactions_propres.csv` | `reducer_join.py` |

---

### Étape 1 — Copier les CSV

Mets tous les fichiers CSV dans un dossier. Exemple :

```bash
mkdir C:\pipeline_data
# Copier les 9 fichiers CSV ici
```

### Étape 2 — Lancer la conversion

Ouvre un terminal dans le dossier `dashboard/` :

```bash
cd src/scripts
python convert_to_json.py --input-dir C:\pipeline_data
```

Ce script :
- Lit chaque fichier CSV
- Le convertit au format JSON attendu par le dashboard
- Écrit les JSON dans `src/data/real/`

### Étape 3 — Activer les données réelles

Ouvre le fichier `src/data/source.js` et change la ligne 6 :

```js
// AVANT (mock data)
export const USE_REAL_DATA = false;

// APRÈS (données du pipeline)
export const USE_REAL_DATA = true;
```

**Un seul changement, une seule ligne.**

### Étape 4 — Lancer le dashboard

```bash
cd dashboard
npm start
```

Le dashboard charge automatiquement les fichiers de `src/data/real/`.

---

## Format attendu des CSV

```
revenue_by_product.csv
  → product_id,revenue[,product_name,category,orders,avg_price,reorder_rate]

ml_metrics.csv
  → metric,value
  ex: accuracy,0.88

confusion_matrix.csv
  → key,value
  ex: true_positives,1250

feature_importance.csv
  → feature,importance
  ex: Taux de ré-achat,0.38

recommendations.csv
  → user_id,product_name,confidence,is_reordered[,category,price]
  ex: U1092,Souris Sans Fil,0.92,1

baskets.csv
  → order_id,products
  ex: ORD-001,"P001,P003,P005"

product_pairs.csv
  → pair,count
  ex: P001,P009,42

product_features_raw.csv
  → product_id,total_apparitions,total_reordered,taux_reordered,avg_position
  ex: P001,320,230,0.72,2.1

transactions_propres.csv
  → order_id,product_id,price,status
  ex: ORD-001,P001,46.88,delivered
```

> **Note :** Les colonnes entre crochets `[]` sont optionnelles. Si absentes, des valeurs par défaut sont utilisées.

---

## Gestion des erreurs

Le dashboard **ne plante jamais** même si :

| Problème | Comportement |
|----------|-------------|
| Fichier CSV manquant | Le script l'ignore, les mock data restent pour ce fichier |
| Valeur manquante dans un CSV | Remplace par 0 ou chaîne vide |
| Type incorrect (texte au lieu de nombre) | Converti automatiquement |
| Fichier JSON corrompu | Le guard sanitize les données |

### Rollback (retour aux mock data)

```js
// src/data/source.js
export const USE_REAL_DATA = false;  // ← Remettre à false
```

Aucune perte de données, les mock data sont toujours présentes dans `src/data/mock/`.

---

## Architecture des données

```
src/data/
├── source.js         ← 🔧 INTERRUPTEUR (1 ligne à changer)
├── dataLoader.js     ← Importe + valide automatiquement
├── dataGuard.js      ← Sanitize toutes les données (anti-crash)
├── mock/             ← Données de développement (toujours disponibles)
│   ├── top_produits.json
│   ├── recommendations_ml.json
│   ├── ml_metrics.json
│   ├── confusion_matrix.json
│   ├── feature_importance.json
│   ├── dashboard_stats.json
│   ├── revenue_trend.json
│   ├── category_stats.json
│   ├── anomalies.json
│   ├── baskets.json
│   ├── product_pairs.json
│   ├── features_raw.json
│   └── transactions_stats.json
└── real/             ← Données du pipeline (écrasées par convert_to_json.py)
    └── ... (mêmes fichiers, mêmes noms)
```

---

## Test rapide

Pour vérifier que tout fonctionne avant la présentation :

```bash
cd dashboard
npm run build
```

Si le build passe (0 erreurs), le dashboard est prêt. Aucune mauvaise surprise possible.
