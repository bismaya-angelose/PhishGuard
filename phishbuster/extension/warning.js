const params = new URLSearchParams(window.location.search);
const blockedUrl = params.get("url");
const hostname = new URL(blockedUrl).hostname.toLowerCase();

document.getElementById("blockedUrl").innerText =
  "Blocked URL: " + blockedUrl;

document.getElementById("closeBtn").addEventListener("click", () => {
  window.close();
});

document.getElementById("markSafe").addEventListener("click", () => {
  chrome.storage.local.get(["safeDomains"], function(result) {
    let safeDomains = result.safeDomains || [];

    if (!safeDomains.includes(hostname)) {
      safeDomains.push(hostname);
    }

    chrome.storage.local.set({ safeDomains: safeDomains }, function() {
      alert("Marked as safe. Reloading...");
      window.location.href = blockedUrl;
    });
  });
});
