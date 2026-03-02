export function extractFeatures(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return [0, 0, 0, 0, 0, 0];
  }

  const suspiciousWords = [
    "verify",
    "update",
    "free",
    "bonus",
    "reward"
  ];

  return [
    url.length,
    (url.match(/\./g) || []).length,
    /^\d+\.\d+\.\d+\.\d+$/.test(parsed.hostname) ? 1 : 0,
    parsed.protocol === "https:" ? 1 : 0,
    (url.match(/[@\-]/g) || []).length,
    suspiciousWords.filter(w =>
      url.toLowerCase().includes(w)
    ).length
  ];
}
