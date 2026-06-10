#!/usr/bin/env python3
"""
convert_to_json.py — Convertit les CSV du pipeline Big Data en JSON pour le dashboard.

Mapping exact des fichiers produits par Ahmed (Module 3):
  revenue_by_product.csv  →  {product_id, revenue}              → top_produits.json
  ml_metrics.csv          →  {metric, value}                     → ml_metrics.json
  confusion_matrix.csv    →  {key, value}                        → confusion_matrix.json
  feature_importance.csv  →  {feature, importance}               → feature_importance.json
  recommendations.csv     →  {user_id, product_name, confidence, is_reordered} → recommendations_ml.json
  baskets.csv             →  {order_id, products}                → baskets.json
  product_pairs.csv       →  {pair, count}                       → product_pairs.json
  product_features_raw.csv → {product_id, total_apparitions, total_reordered, taux_reordered, avg_position} → features_raw.json
  transactions_propres.csv → {order_id, product_id, price, status} → transactions_stats.json

Usage:
  python src/scripts/convert_to_json.py --input-dir /chemin/csv
  # Écrit dans src/data/real/
  # Puis changer USE_REAL_DATA = true dans src/data/source.js
"""

import argparse
import csv
import json
import os

REAL_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "real")


def parse_args():
    p = argparse.ArgumentParser(description="Convert Big Data pipeline CSVs to dashboard JSON")
    p.add_argument("--input-dir", default=None, help="Directory containing CSV files from Ahmed's pipeline")
    p.add_argument("--out-dir", default=REAL_DIR, help="Output directory for JSON files")
    return p.parse_args()


def load_csv(path):
    if not path or not os.path.exists(path):
        return None
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


# ─── TOP PRODUITS ───
def convert_revenue(path):
    """revenue_by_product.csv: product_id, revenue → top_produits.json"""
    rows = load_csv(path)
    if not rows:
        return None
    result = []
    for r in rows:
        result.append({
            "id": r.get("product_id", "").strip(),
            "name": r.get("product_id", "").strip(),
            "revenue": float(r.get("revenue", 0)),
            "category": r.get("category", "Général").strip() or "Général",
            "orders": int(r.get("orders", 0)) if r.get("orders", "").strip() else 0,
            "avg_price": float(r.get("avg_price", 0)) if r.get("avg_price", "").strip() else 0.0,
            "reorder_rate": float(r.get("reorder_rate", 0)) if r.get("reorder_rate", "").strip() else 0.0,
        })
    result.sort(key=lambda x: x["revenue"], reverse=True)
    return result


# ─── ML METRICS ───
def convert_metrics(path):
    """ml_metrics.csv: metric, value → ml_metrics.json"""
    rows = load_csv(path)
    if not rows:
        return None
    data = {r["metric"].strip(): float(r["value"]) for r in rows}
    return {
        "accuracy": data.get("accuracy", 0),
        "precision": data.get("precision", 0),
        "recall": data.get("recall", 0),
        "f1_score": data.get("f1_score", 0),
    }


# ─── CONFUSION MATRIX ───
def convert_confusion(path):
    """confusion_matrix.csv: key, value → confusion_matrix.json"""
    rows = load_csv(path)
    if not rows:
        return None
    data = {r["key"].strip(): int(r["value"]) for r in rows}
    return {
        "true_positives": data.get("true_positives", 0),
        "false_positives": data.get("false_positives", 0),
        "true_negatives": data.get("true_negatives", 0),
        "false_negatives": data.get("false_negatives", 0),
    }


# ─── FEATURE IMPORTANCE ───
def convert_features(path):
    """feature_importance.csv: feature, importance → feature_importance.json"""
    rows = load_csv(path)
    if not rows:
        return None
    result = []
    for r in rows:
        result.append({
            "feature": r.get("feature", "").strip(),
            "importance": float(r.get("importance", 0)),
        })
    return result


# ─── RECOMMENDATIONS ───
def convert_recommendations(path):
    """recommendations.csv: user_id, product_name, confidence, is_reordered → recommendations_ml.json"""
    rows = load_csv(path)
    if not rows:
        return None
    result = []
    for r in rows:
        result.append({
            "user_id": r.get("user_id", "").strip(),
            "product_name": r.get("product_name", "").strip(),
            "confidence": float(r.get("confidence", 0)),
            "is_reordered": r.get("is_reordered", "0").strip() in ("1", "true", "True", "Oui", "yes"),
            "category": r.get("category", "").strip(),
            "price": float(r.get("price", 0)) if r.get("price", "").strip() else 0.0,
        })
    return result


# ─── BASKETS ───
def convert_baskets(path):
    """baskets.csv: order_id, products → baskets.json"""
    rows = load_csv(path)
    if not rows:
        return None
    result = []
    for r in rows:
        products = r.get("products", "").strip()
        result.append({
            "order_id": r.get("order_id", "").strip(),
            "products": [p.strip() for p in products.split(",") if p.strip()] if products else [],
        })
    return result


# ─── PRODUCT PAIRS ───
def convert_pairs(path):
    """product_pairs.csv: pair, count → product_pairs.json"""
    rows = load_csv(path)
    if not rows:
        return None
    result = []
    for r in rows:
        pair = r.get("pair", "").strip()
        p = pair.split(",")
        result.append({
            "product_a": p[0].strip() if len(p) > 0 else "",
            "product_b": p[1].strip() if len(p) > 1 else "",
            "count": int(r.get("count", 0)),
        })
    result.sort(key=lambda x: x["count"], reverse=True)
    return result


# ─── PRODUCT FEATURES RAW ───
def convert_features_raw(path):
    """product_features_raw.csv: product_id, total_apparitions, total_reordered, taux_reordered, avg_position → features_raw.json"""
    rows = load_csv(path)
    if not rows:
        return None
    result = []
    for r in rows:
        result.append({
            "product_id": r.get("product_id", "").strip(),
            "total_apparitions": int(r.get("total_apparitions", 0)),
            "total_reordered": int(r.get("total_reordered", 0)),
            "taux_reordered": float(r.get("taux_reordered", 0)),
            "avg_position": float(r.get("avg_position", 0)),
        })
    return result


# ─── TRANSACTIONS STATS ───
def convert_transactions(path):
    """transactions_propres.csv: order_id, product_id, price, status → transactions_stats.json"""
    rows = load_csv(path)
    if not rows:
        return None
    return {
        "total_transactions": len(rows),
        "total_revenue": sum(float(r.get("price", 0)) for r in rows),
        "delivered": sum(1 for r in rows if r.get("status", "").strip().lower() == "delivered"),
        "products": len(set(r.get("product_id", "").strip() for r in rows if r.get("product_id", "").strip())),
    }


# ─── MAIN ───
def main():
    args = parse_args()
    os.makedirs(args.out_dir, exist_ok=True)
    input_dir = args.input_dir or args.out_dir

    converters = [
        ("top_produits.json", convert_revenue(os.path.join(input_dir, "revenue_by_product.csv"))),
        ("ml_metrics.json", convert_metrics(os.path.join(input_dir, "ml_metrics.csv"))),
        ("confusion_matrix.json", convert_confusion(os.path.join(input_dir, "confusion_matrix.csv"))),
        ("feature_importance.json", convert_features(os.path.join(input_dir, "feature_importance.csv"))),
        ("recommendations_ml.json", convert_recommendations(os.path.join(input_dir, "recommendations.csv"))),
        ("baskets.json", convert_baskets(os.path.join(input_dir, "baskets.csv"))),
        ("product_pairs.json", convert_pairs(os.path.join(input_dir, "product_pairs.csv"))),
        ("features_raw.json", convert_features_raw(os.path.join(input_dir, "product_features_raw.csv"))),
        ("transactions_stats.json", convert_transactions(os.path.join(input_dir, "transactions_propres.csv"))),
    ]

    print(f"📁 Conversion → {args.out_dir}")
    for name, data in converters:
        path = os.path.join(args.out_dir, name)
        if data is not None:
            with open(path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            n = len(data) if isinstance(data, list) else 1
            print(f"  ✅ {name} ({n} entrées)")
        else:
            print(f"  ⬜ {name} — fichier source absent, ignoré")

    print(f"\n👉 Puis: changer USE_REAL_DATA = true dans src/data/source.js")


if __name__ == "__main__":
    main()
