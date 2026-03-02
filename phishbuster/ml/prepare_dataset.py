import pandas as pd
from feature_extractor import extract_features

# ==== LOAD PHISHING DATA ====
phish = pd.read_csv("../dataset/phishing_raw.csv")
phish = phish[["url"]]
phish["label"] = 1

# ==== LOAD TRANCO DATA CORRECTLY ====
# Force no header so pandas doesn't treat first row as column names
tranco = pd.read_csv("../dataset/tranco.csv", header=None)

# Tranco format: rank, domain
tranco.columns = ["rank", "domain"]

# Convert domains into full URLs
legit = pd.DataFrame()
legit["url"] = "https://" + tranco["domain"].astype(str)
legit["label"] = 0

# Take top 20000 legit samples
legit = legit.head(20000)

# Balance dataset
phish = phish.sample(n=min(len(phish), len(legit)), random_state=42)

# Combine both
df = pd.concat([phish, legit], ignore_index=True)

# Extract features
X = df["url"].apply(extract_features)
X = pd.DataFrame(X.tolist())

X["label"] = df["label"]

# Save final dataset
X.to_csv("../dataset/final_dataset.csv", index=False)

print("Balanced dataset created:", X.shape)
print("Phishing count:", sum(df["label"] == 1))
print("Legit count:", sum(df["label"] == 0))
