function updatePopup(data) {
    const status = document.getElementById("status");
    const details = document.getElementById("details");
  
    if (!data || !data.password) {
      status.style.display = "block";
      details.style.display = "none";
      status.textContent = "🔍 No password field detected.";
      return;
    }
  
    status.style.display = "none";
    details.style.display = "block";
    document.getElementById("strength").textContent = data.strengthLabel;
    document.getElementById("breach").textContent = data.breached ? "⚠️ Found in breaches" : "✅ Not found in breaches";
    document.getElementById("tips").textContent = data.suggestions.join(", ");
  }
  
  // Request latest password info from content script
  chrome.runtime.sendMessage({ action: "getPasswordStatus" }, (response) => {
    updatePopup(response);
  });
  