import joblib
import json

model = joblib.load("phish_model.pkl")

data = {
    "weights": model.coef_[0].tolist(),
    "bias": model.intercept_[0]
}

with open("../extension/model.json", "w") as f:
    json.dump(data, f, indent=2)

print("Model exported to extension/model.json")
