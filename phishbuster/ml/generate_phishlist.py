import pandas as pd
import json
from urllib.parse import urlparse

phish = pd.read_csv("../dataset/phishing_raw.csv")
phish_urls = phish["url"].dropna().unique().tolist()

# Extract domains only
domains = set()

for url in phish_urls:
    try:
        domain = urlparse(url).hostname
        if domain:
            domains.add(domain.lower())
    except:
        pass

# Save for extension use
with open("../extension/phishlist.json", "w") as f:
    json.dump(list(domains), f)

print("Phishlist created. Domains:", len(domains))
