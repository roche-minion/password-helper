# 🔐 Password Sensei

A lightweight, friendly Chrome extension that helps you create **strong, secure passwords**—with **real-time feedback** and **breach detection**—without the frustration of using random password generators.

---

## 🌟 Features

- 🧠 **Real-time Password Strength Analysis**  
  Understand how strong your password is *as you type*, using smart heuristics (powered by [zxcvbn](https://github.com/dropbox/zxcvbn)).

- 🚨 **Breach Detection**  
  Warns you if your password has been found in past data breaches using the Have I Been Pwned API.

- 💡 **Actionable Suggestions**  
  Offers clear, helpful tips for making your password stronger—based on best practices, not arbitrary rules.

---

## 🧭 How to Install on Google Chrome

1. **Download or Clone the Repository**

   ```bash
   git clone https://github.com/roche-minion/password-sensei.git
   ```

   Or simply download the `.zip` and extract it.

2. **Open Chrome and Visit the Extensions Page**

   - Go to: `chrome://extensions/`
   - Enable **Developer mode** (top-right toggle)

3. **Load the Extension**

   - Click **“Load unpacked”**
   - Select the folder you just downloaded or extracted

4. **Done! 🎉**

   The extension will now be active. Try focusing on any password field on a website to see the helper appear!

---

## 💬 How It Works

- When you focus on a password field, a small floating panel appears on the webpage.
- As you type, it:
  - Evaluates your password strength
  - Checks if your password has been breached before
  - Checks if you have reused the password before in any other site.
  - Gives you simple tips to improve your password

### ✅ Example Tip:
> "Add a few uncommon words or a passphrase—longer is stronger!"

Unlike random password generators, this plugin encourages **natural, memorable, and secure** password creation. No need to copy/paste unreadable strings like `!p5R&z8K!`—just build a smart password *you* can remember.

---

## 🔒 Why It’s Safe

- Raw Data is **not stored anywhere**.
- Date is not sent anywhere except to **Have I Been Pwned** via a privacy-friendly k-anonymity API.
- All password analysis happens **locally in your browser**.
- No trackers, no cloud syncing, no nonsense.

---

## 🚀 Contributing

Pull requests are welcome! If you’d like to suggest features or fix bugs, please fork the repo and open a PR.

---

Created with ❤️

Saint Louis University – Master’s Research Project (CYBR 5960)
