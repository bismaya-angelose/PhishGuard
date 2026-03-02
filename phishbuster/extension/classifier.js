import { extractFeatures } from "./features.js";

let modelCache = null;

async function loadModel() {
  if (modelCache) return modelCache;
  const res = await fetch(chrome.runtime.getURL("model.json"));
  modelCache = await res.json();
  return modelCache;
}

export async function getRiskScore(url) {
  const model = await loadModel();
  const features = extractFeatures(url);

  let score = model.bias;

  for (let i = 0; i < features.length; i++) {
    score += features[i] * model.weights[i];
  }

  return 1 / (1 + Math.exp(-score));
}
