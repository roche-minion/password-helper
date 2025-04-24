function createFloatingPanel() {
    const panel = document.createElement("div");
    panel.id = "password-helper";
    panel.style.position = "fixed";
    panel.style.top = "20px";
    panel.style.right = "20px";
    panel.style.backgroundColor = "#ffffff";
    panel.style.border = "1px solid #ccc";
    panel.style.boxShadow = "0 2px 10px rgba(0,0,0,0.15)";
    panel.style.borderRadius = "10px";
    panel.style.padding = "16px";
    panel.style.fontFamily = "Segoe UI, sans-serif";
    panel.style.fontSize = "14px";
    panel.style.zIndex = "10000";
    panel.style.maxWidth = "300px";
    panel.innerHTML = `
      <div id="helper-status">🔍 No password field detected.</div>
      <div id="helper-details" style="display: none;">
        <p><strong>Status:</strong> Password field detected</p>
        <p><strong>Strength:</strong> <span id="helper-strength"></span></p>
        <p><strong>Breach Check:</strong> <span id="helper-breach"></span></p>
        <p><strong>Reuse Check:</strong> <span id="helper-reuse"></span></p>
        <p><strong>Tips for Strength:</strong> <span id="helper-tips"></span></p>
        <!-- Place inside #details div -->
<button id="save-btn" style="margin-top: 10px; padding: 6px 12px; font-size: 14px; border-radius: 6px; border: none; background-color: #4CAF50; color: white; cursor: pointer;">
  💾 Save Password
</button>
<div id="save-status" style="margin-top: 8px; font-size: 12px; color: #666;"></div>

      </div>
    `;
    document.body.appendChild(panel);
    return panel;
  }
  
  let panel = createFloatingPanel();
  let currentPassword = "";
  
  document.addEventListener("input", async (event) => {
    document.getElementById("save-status").textContent = "";
    if (event.target.type === "password") {
      const password = event.target.value;
      currentPassword = password;
        console.log(password);
      if (typeof zxcvbn !== "undefined") {
        const hash = await hashPassword(password);
        const result = zxcvbn(password);
        const breached = await checkBreach(password);

        chrome.storage.local.get(["passwordHashes"], (data) => {
            const hashes = data.passwordHashes || [];
            const isReused = hashes.includes(hash);
            document.getElementById("helper-reuse").textContent =
          isReused ? "🚫 Password is Reused" : "✅ Password not reused";
        });
  
        document.getElementById("helper-status").style.display = "none";
        document.getElementById("helper-details").style.display = "block";
  
        document.getElementById("helper-strength").textContent =
          ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"][result.score];
  
        document.getElementById("helper-breach").textContent =
          breached ? "⚠️ Found in breaches" : "✅ Not found in breaches";
  
        document.getElementById("helper-tips").textContent =
          result.feedback.suggestions.length > 0
            ? result.feedback.suggestions.join(", ")
            : "No suggestions needed. Looks good!";
      }
    }
  });

  document.getElementById("save-btn").addEventListener("click", async () => {
    cachedPassword = currentPassword;
    if (!cachedPassword) {
      document.getElementById("save-status").textContent = "⚠️ No password to save.";
      return;
    }
  
    const hash = await hashPassword(cachedPassword);
  
    chrome.storage.local.get(["passwordHashes"], (data) => {
      const hashes = data.passwordHashes || [];
      if (!hashes.includes(hash)) {
        hashes.push(hash);
        chrome.storage.local.set({ passwordHashes: hashes }, () => {
          document.getElementById("save-status").textContent = "✅ Password saved!";
        });
      } else {
        document.getElementById("save-status").textContent = "ℹ️ Password already stored.";
      }
    });
  });
  

  // SHA-256 utility
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }
  