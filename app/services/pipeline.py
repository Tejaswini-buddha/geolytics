import random
import math


# ================================
# FEATURE ENGINEERING
# ================================
def extract_features(keyword: str):
    """
    Convert keyword into usable numeric features
    """
    length = len(keyword)
    words = len(keyword.split())
    has_numbers = any(char.isdigit() for char in keyword)
    complexity = length * words

    return {
        "length": length,
        "words": words,
        "has_numbers": int(has_numbers),
        "complexity": complexity,
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
    """
    If models exist, use them. Otherwise fallback to logic.
    """
    try:
        feature_list = [
            features["length"],
            features["words"],
            features["has_numbers"],
            features["complexity"],
        ]

        if clf:
            category = clf.predict([feature_list])[0]
        else:
            category = "generic"

        if reg:
            predicted_score = int(reg.predict([feature_list])[0])
        else:
            predicted_score = None

        return category, predicted_score

    except Exception:
        return "generic", None


# ================================
# MAIN PIPELINE FUNCTION
# ================================
def run_full_pipeline(keyword, clf=None, reg=None):
    """
    Main GEOlytics AI pipeline
    """

    # Step 1: Extract features
    features = extract_features(keyword)

    # Step 2: Scores
    geo_score = calculate_geo_score(features)
    aeo_score = calculate_aeo_score(features)

    # Step 3: Visibility
    visibility = calculate_visibility(geo_score)

    # Step 4: ML predictions
    category, predicted_score = apply_ml_models(features, clf, reg)

    # Step 5: Recommendations
    recommendations = generate_recommendations(keyword, geo_score, aeo_score)

    # Final response
    return {
        "keyword": keyword,
        "features": features,
        "geo_score": geo_score,
        "aeo_score": aeo_score,
        "visibility": visibility,
        "category": category,
        "ml_score": predicted_score,
        "recommendations": recommendations,
    }