import random
import math


# ================================
# FEATURE ENGINEERING (FIXED)
# ================================
def extract_features(keyword):
    words = keyword.split()

    return {
        "length": len(keyword),
        "words": len(words),
        "has_numbers": any(c.isdigit() for c in keyword),
        "complexity": len(set(words)),
    }

# ===============================
def run_full_pipeline(keyword):
    features = extract_features(keyword)

    geo_score = calculate_geo_score(features)
    aeo_score = calculate_aeo_score(features)

    visibility = calculate_visibility(geo_score)

    recommendations = generate_recommendations(keyword, geo_score, aeo_score)

    return {
        "keyword": keyword,
        "geo_score": geo_score,
        "aeo_score": aeo_score,
        "visibility": visibility,
        "recommendations": recommendations,
    }


# ================================
# GEO SCORE CALCULATION
# ================================
def calculate_geo_score(features):
    base = 50

    base += features["words"] * 5
    base += min(features["length"], 20)
    base -= features["has_numbers"] * 5

    return min(100, max(40, base + random.randint(-5, 5)))


# ================================
# AEO SCORE CALCULATION
# ================================
def calculate_aeo_score(features):
    score = 50

    if features["words"] >= 3:
        score += 15

    if features["length"] > 10:
        score += 10

    return min(100, score + random.randint(-5, 5))


# ================================
# VISIBILITY LOGIC
# ================================
def calculate_visibility(geo_score):
    if geo_score > 80:
        return "High"
    elif geo_score > 60:
        return "Medium"
    else:
        return "Low"


# ================================
# RECOMMENDATIONS ENGINE
# ================================
def generate_recommendations(keyword, geo_score, aeo_score):
    recs = []

    if geo_score < 70:
        recs.append(f"Improve content depth for '{keyword}'")

    if aeo_score < 70:
        recs.append("Add FAQ schema & structured data")

    recs.append("Optimize for featured snippets")
    recs.append("Increase authority backlinks")
    recs.append("Use entity-based SEO strategy")

    return recs


# ================================
# OPTIONAL ML MODEL USAGE
# ================================
def apply_ml_models(features, clf=None, reg=None):
    try:
        feature_list = [
            features["length"],
            features["words"],
            features["has_numbers"],
            features["complexity"],
        ]

        category = clf.predict([feature_list])[0] if clf else "generic"
        predicted_score = int(reg.predict([feature_list])[0]) if reg else None

        return category, predicted_score

    except Exception:
        return "generic", None


# ================================
# FINAL PIPELINE (FIXED)
# ================================
def run_full_pipeline(keyword, clf=None, reg=None):
    """
    GEOlytics AI Pipeline (clean + working)
    """

    # Step 1: Feature Extraction
    features = extract_features(keyword)

    # Step 2: Score Calculation
    geo_score = calculate_geo_score(features)
    aeo_score = calculate_aeo_score(features)

    # Step 3: Visibility
    visibility = calculate_visibility(geo_score)

    # Step 4: ML (optional)
    category, predicted_score = apply_ml_models(features, clf, reg)

    # Step 5: Recommendations
    recommendations = generate_recommendations(keyword, geo_score, aeo_score)

    # Final Output
    return {
        "keyword": keyword,
        "geo_score": geo_score,
        "aeo_score": aeo_score,
        "visibility": visibility,
        "recommendations": recommendations,
        "category": category,
        "predicted_score": predicted_score,
    }