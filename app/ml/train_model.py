import pandas as pd
import numpy as np
import pickle
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor

np.random.seed(42)

data_size = 200

data = pd.DataFrame({
    "word_count": np.random.randint(500, 3000, data_size),
    "faq_schema": np.random.randint(0, 2, data_size),
    "entity_density": np.random.uniform(0.2, 0.9, data_size),
})

data["is_cited"] = (
    (data["word_count"] > 1200) &
    (data["entity_density"] > 0.5)
).astype(int)

data["geo_score"] = (
    data["word_count"] * 0.02 +
    data["entity_density"] * 50 +
    data["faq_schema"] * 10
)

X = data[["word_count", "faq_schema", "entity_density"]]
y_class = data["is_cited"]
y_reg = data["geo_score"]

clf = RandomForestClassifier()
clf.fit(X, y_class)

reg = RandomForestRegressor()
reg.fit(X, y_reg)

# SAVE MODELS
with open("app/ml/classifier.pkl", "wb") as f:
    pickle.dump(clf, f)

with open("app/ml/regressor.pkl", "wb") as f:
    pickle.dump(reg, f)

print("Models saved successfully!")