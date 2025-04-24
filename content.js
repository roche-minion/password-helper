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
        <p><strong>Tips:</strong> <span id="helper-tips"></span></p>
      </div>
    `;
    document.body.appendChild(panel);
    return panel;
  }
  
  let panel = createFloatingPanel();
  
  document.addEventListener("input", async (event) => {
    if (event.target.type === "password") {
      const password = event.target.value;
  
      if (typeof zxcvbn !== "undefined") {
        const result = zxcvbn(password);
        const breached = await checkBreach(password);
  
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
  