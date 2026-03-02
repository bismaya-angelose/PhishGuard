let phishSet = new Set();
let phishLoaded = false;

/* ===============================
   LOAD PHISH LIST SAFELY
================================ */
async function loadPhishList() {
  try {
    const res = await fetch(chrome.runtime.getURL("phishlist.json"));
    if (!res.ok) throw new Error("phishlist.json not accessible");

    const data = await res.json();

    if (Array.isArray(data)) {
      phishSet = new Set(data.map(d => String(d).toLowerCase()));
      phishLoaded = true;
      console.log("Phish list loaded:", phishSet.size);
    } else {
      throw new Error("Invalid JSON format");
    }
  } catch (err) {
    console.error("Failed to load phishlist:", err);
  }
}

loadPhishList();

/* ===============================
   TAB MONITOR
================================ */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

  if (!phishLoaded) return;
  if (changeInfo.status !== "complete") return;
  if (!tab.url) return;

  const url = tab.url;

  if (
    url.startsWith("chrome://") ||
    url.startsWith("chrome-extension://") ||
    url.startsWith("about:") ||
    url.includes("warning.html")
  ) return;

  let hostname;

  try {
    hostname = new URL(url).hostname.toLowerCase();
  } catch (e) {
    console.warn("Invalid URL skipped:", url);
    return;
  }

  // Safe fallback if storage not ready
  if (!chrome.storage || !chrome.storage.local) {
    console.error("Storage API unavailable");
    return;
  }

  chrome.storage.local.get(["safeDomains"], (result) => {
    const safeDomains = new Set(result.safeDomains || []);

    if (safeDomains.has(hostname)) {
      console.log("User-approved safe:", hostname);
      return;
    }

    if (phishSet.has(hostname)) {
      console.warn("Blocking known phishing domain:", hostname);

      chrome.tabs.update(tabId, {
        url: chrome.runtime.getURL("warning.html") +
             "?url=" + encodeURIComponent(url)
      });
    }
  });
});
