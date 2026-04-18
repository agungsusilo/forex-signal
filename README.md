# AURUM · XAU/USD Signal Intelligence
### Deploy to Vercel from Android — Step by Step

---

## Project Structure
```
aurum-signal/
├── api/
│   ├── anthropic.js      ← Serverless proxy for Claude AI
│   └── twelvedata.js     ← Serverless proxy for live price data
├── public/
│   └── index.html        ← The full dashboard UI
├── package.json
├── vercel.json
└── README.md
```

---

## Step 1 — Install apps on your Android phone

| App | Where to get | Purpose |
|-----|-------------|---------|
| **Termux** | F-Droid (recommended) or Play Store | Linux terminal for Git & Vercel CLI |
| **Acode** or **Spck Editor** | Play Store | Edit files if needed |
| **GitHub** app | Play Store | Manage your repo |
| **Chrome** | Pre-installed | Vercel dashboard |

> ⚠️ Install Termux from **F-Droid** for the best experience:
> https://f-droid.org/packages/com.termux/

---

## Step 2 — Set up Termux

Open Termux and run these commands one by one:

```bash
# Update packages
pkg update && pkg upgrade -y

# Install Git and Node.js
pkg install git nodejs -y

# Install Vercel CLI globally
npm install -g vercel
```

---

## Step 3 — Create a GitHub repository

1. Open the **GitHub app** or go to **github.com** in Chrome
2. Tap **+** → **New repository**
3. Name it: `aurum-signal`
4. Set to **Private**
5. Tap **Create repository**
6. Copy the repo URL (looks like `https://github.com/YOUR_USERNAME/aurum-signal.git`)

---

## Step 4 — Upload the project to GitHub

In Termux:

```bash
# Go to Termux home folder
cd ~

# Unzip the project (if you downloaded the zip)
pkg install unzip -y
unzip aurum-signal.zip -d aurum-signal
cd aurum-signal

# Set up Git
git config --global user.email "your@email.com"
git config --global user.name "Your Name"

# Initialize and push to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aurum-signal.git
git push -u origin main
```

> When prompted for password, use a **GitHub Personal Access Token** (not your password):
> GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic) → Generate new token
> Check the `repo` scope. Copy and paste it as your password in Termux.

---

## Step 5 — Deploy to Vercel

In Termux (still inside the `aurum-signal` folder):

```bash
vercel login
```

This opens a browser link — tap it, log in with your Vercel account (or create one free at vercel.com), then come back to Termux.

```bash
vercel
```

Answer the prompts:
- **Set up and deploy?** → Y
- **Which scope?** → your username
- **Link to existing project?** → N
- **Project name?** → aurum-signal
- **In which directory is your code?** → ./  (just press Enter)
- **Want to modify settings?** → N

Vercel will deploy and give you a URL like `https://aurum-signal-xyz.vercel.app`

---

## Step 6 — Add your API keys in Vercel

This is the most important step. Open Chrome and go to:
**https://vercel.com → your project → Settings → Environment Variables**

Add these two variables:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | Your key from console.anthropic.com |
| `TD_API_KEY` | Your key from twelvedata.com (optional) |

After adding them, **redeploy** so the new env vars take effect:

```bash
# Back in Termux
vercel --prod
```

---

## Step 7 — Open your live app

Go to your Vercel URL in Chrome:
```
https://aurum-signal-YOUR-ID.vercel.app
```

- If you added `TD_API_KEY` in Vercel, optionally also paste it in the banner on the page for the live price indicator pills
- Click **SCAN MARKET** — it should work!

---

## How the API keys work

```
Your Browser
    │
    ├─ /api/anthropic   → Vercel Function → Anthropic API (key is ANTHROPIC_API_KEY in Vercel)
    └─ /api/twelvedata  → Vercel Function → Twelve Data API (key is TD_API_KEY in Vercel)
```

Your Anthropic key **never touches the browser** — it lives only in Vercel's secure environment. 

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `vercel: command not found` | Run `npm install -g vercel` again |
| `git push` asks for password repeatedly | Use a GitHub Personal Access Token as the password |
| App loads but scan fails | Check that `ANTHROPIC_API_KEY` is set in Vercel env vars and you redeployed with `vercel --prod` |
| Twelve Data errors | Your free tier may be rate-limited (800 calls/day). Wait or upgrade |
| Blank page after deploy | Check Vercel → your project → Deployments → click deployment → Functions tab for errors |

---

## Get your API keys

- **Anthropic:** https://console.anthropic.com → API Keys
- **Twelve Data (free):** https://twelvedata.com → Sign up → API Key

---

*For educational purposes only. Not financial advice.*
