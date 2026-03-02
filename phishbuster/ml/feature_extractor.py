import re
import math
from urllib.parse import urlparse

SUSPICIOUS_WORDS = [
    "verify", "update", "bonus", "reward", "free"
]

def entropy(string):
    prob = [float(string.count(c)) / len(string) for c in dict.fromkeys(list(string))]
    return -sum([p * math.log2(p) for p in prob])

def extract_features(url):
    parsed = urlparse(url)
    domain = parsed.netloc

    return [
        len(url),                                  # URL length
        url.count("."),                            # Dot count
        1 if re.match(r"\d+\.\d+\.\d+\.\d+", domain) else 0,
        1 if parsed.scheme == "https" else 0,
        sum(url.count(c) for c in ["@", "-", "_"]),
        sum(word in url.lower() for word in SUSPICIOUS_WORDS),
        len(domain),
        entropy(url)
    ]
