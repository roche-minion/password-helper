function makeDraggable(panel, handle) {
    let offsetX = 0, offsetY = 0, startX = 0, startY = 0;
  
    handle.onmousedown = dragStart;
  
    function dragStart(e) {
      e.preventDefault();
      startX = e.clientX;
      startY = e.clientY;
      document.onmousemove = drag;
      document.onmouseup = stopDrag;
    }
  
    function drag(e) {
      e.preventDefault();
      offsetX = startX - e.clientX;
      offsetY = startY - e.clientY;
      startX = e.clientX;
      startY = e.clientY;
  
      panel.style.top = (panel.offsetTop - offsetY) + "px";
      panel.style.left = (panel.offsetLeft - offsetX) + "px";
      panel.style.right = "auto"; // prevent CSS override
    }
  
    function stopDrag() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
  

  function createFloatingPanel() {
    const container = document.createElement("div");
    container.id = "password-helper-container";
    container.style.position = "fixed";
    container.style.top = "20px";
    container.style.right = "20px";
    container.style.zIndex = "10000";
    container.style.borderRadius = "10px";
    container.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
    container.style.backgroundColor = "#ffffff";
    container.style.fontFamily = "Segoe UI, sans-serif";
    container.style.fontSize = "14px";
    container.style.maxWidth = "320px";
    container.style.userSelect = "none";
    container.style.zIndex = "2147483647";

  
    container.innerHTML = `
      <div id="drag-handle" style="
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f1f1f1;
  cursor: move;
  font-weight: bold;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  color: #333;
">
  <span>🔐 Password Helper</span>
  <button id="close-btn" style="
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: #999;
    margin-left: 10px;
  " title="Close panel">✖</button>
</div>
      <div id="password-helper" style="padding: 16px;">
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
      </div>
    `;
  
    document.body.appendChild(container);
    document.getElementById("close-btn").addEventListener("click", () => {
        container.style.display = "none";
      });
    makeDraggable(container, container.querySelector("#drag-handle"));
    return document.getElementById("password-helper");
  }
  
  
  let panel = createFloatingPanel();
  document.getElementById("password-helper-container").style.display = "none";
  let currentPassword = "";
  
  document.addEventListener("input", async (event) => {
    document.getElementById("save-status").textContent = "";
    document.getElementById("password-helper-container").style.display = "block";
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
  