# ⚔️ Spamurai — WhatsApp Bulk Sender (API‑Free for Termux)

**Spamurai** is a high‑precision, API‑free WhatsApp automation tool built for **Termux on Android**. It allows power users and developers to send **bulk messages, media, and documents** (APKs, PDFs, Images, Videos) directly from their phone — without Selenium, browsers, or paid APIs.

Powered by `@whiskeysockets/baileys`, Spamurai connects directly to WhatsApp’s **Multi‑Device Web Protocol** for fast, lightweight, and efficient automation.

---

## 🚀 Features

* 📦 **Universal Attachment Support** — Send APKs, PDFs, Images, Videos, and more
* 📊 **Smart CSV Parsing** — Supports `phone` or `phone,name` formats
* ⚡ **No API / No Browser** — Runs fully inside Termux
* 🔐 **Dual Authentication** — QR Scan or Pairing Code (OTP)
* 🧠 **Human‑Like Delay** — Built‑in 6‑second interval to reduce ban risk
* 📱 **Mobile‑Optimized** — Lightweight and fast on Android

---

## 🛠️ Requirements

* **Termux** (Recommended from F‑Droid)
* **Node.js (LTS)**
* **Git**

---

## 📥 Installation (Termux)

### 1️⃣ Update & Install Dependencies

```bash
pkg update && pkg upgrade -y
pkg install nodejs-lts git -y
```

### 2️⃣ Setup Project

```bash
mkdir Spamurai
cd Spamurai
# Place index.js and package.json here
npm install
```

---

## ▶️ Usage

### Enable Wake Lock (Prevents Sleep)

```bash
termux-wake-lock
```

### Start Spamurai

```bash
node index.js
```

---

## 🔑 Authentication Options

### ✅ QR Code Login

Scan via WhatsApp → **Linked Devices**

### ✅ Pairing Code Login (OTP)

Enter phone number → Receive 8‑digit code → Pair device

---

## 📂 Contact CSV Format

### Option 1 — Phone Only

```
919999999999
918888888888
```

### Option 2 — Phone + Name

```
919999999999,John
918888888888,Amit
```

---

## 📤 Sending Messages & Files

When prompted:

* Enter message text
* Enter attachment filename (optional)
* Spamurai auto‑detects file type and sends accordingly

### Supported Files

```
.apk
.pdf
.jpg / .png
.mp4
```

---

## 🧪 Anti‑Ban Strategy

Spamurai includes:

* ⏳ 6‑second delay between sends
* 🧍 Human‑like sending behavior
* ⚠️ No instant mass‑blast (safer)

**Recommended:** Start with **50–200 messages/day**

---

## ⚠️ Disclaimer

This project is for **educational and research purposes only**.

Misuse may violate WhatsApp’s Terms of Service.

You are fully responsible for how you use this tool.

---

## 🧠 Roadmap (Optional)

* GUI mode
* Multi‑session support
* Smart rate‑limit engine
* Message templates
* Resume failed jobs

---

## 👑 Credits

* WhatsApp Web Protocol — `@whiskeysockets/baileys`
* Project — **Spamurai**

---

## ⭐ Support

If you like this project, **star the repo** and contribute — let’s make **Spamurai** sharper than ever.
pkg update && pkg upgrade -y
pkg install nodejs-lts git -y

2️⃣ Setup Project

mkdir Spamurai
cd Spamurai
# Place index.js and package.json here
npm install


---

▶️ Usage

Enable Wake Lock (Prevents Sleep)

termux-wake-lock

Start Spamurai

node index.js


---

🔑 Authentication Options

✅ QR Code Login

Scan via WhatsApp → Linked Devices

✅ Pairing Code Login (OTP)

Enter phone number → Receive 8-digit code → Pair device


---

📂 Contact CSV Format

Option 1 — Phone Only

919999999999
918888888888

Option 2 — Phone + Name

919999999999,John
918888888888,Amit


---

📤 Sending Messages & Files

When prompted:

Enter message text

Enter attachment filename (optional)

Spamurai auto-detects file type and sends accordingly


Supported Files

.apk
.pdf
.jpg / .png
.mp4


---

🧪 Anti-Ban Strategy

Spamurai includes:

⏳ 6-second delay between sends

🧍 Human-like sending behavior

⚠️ No instant mass-blast (safer)


Recommended: Start with 50–200 messages/day


---

⚠️ Disclaimer

This project is for educational and research purposes only.

Misuse may violate WhatsApp’s Terms of Service.

You are fully responsible for how you use this tool.


---

🧠 Roadmap (Optional)

GUI mode

Multi-session support

Smart rate-limit engine

Message templates

Resume failed jobs



---

👑 Credits

WhatsApp Web Protocol — @whiskeysockets/baileys

Project — Spamurai



---

⭐ Support

If you like this project, star the repo and contribute — let’s make Spamurai sharper than ever.
