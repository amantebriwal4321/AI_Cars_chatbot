# 🚀 Deployment Guide: Taking Your Chatbot Live

Deploy your chatbot to the internet **for free** using **Render.com** — no payment info required!

---

## Quick Deploy Settings (for Render.com)

When creating your Web Service on Render, use these **exact settings**:

| Setting | Value |
|---------|-------|
| **Name** | `autoexpert-bot` |
| **Region** | `Singapore (Southeast Asia)` ← closest to India |
| **Branch** | `main` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | `Free` (scroll down to select) |

Then click **"Deploy Web Service"** → Wait 2-3 minutes ⏳

After deployment, add your API key:
- Go to **Environment** (left sidebar) → **Add Environment Variable**
- **Key**: `GEMINI_API_KEY`
- **Value**: *(your actual API key)*

---

## Option 1: Auto-Deploy with AI (Paste this Prompt) ⭐

Open this project in your AI assistant (Antigravity, Claude, Gemini, etc.) and paste:

```text
I want to deploy this chatbot to the internet using Render.com (free tier). Please execute this entire process for me step-by-step. Do NOT skip any step.

1. PREP CHECK: Make sure I have a `requirements.txt` and a `Procfile` in this project. If the `requirements.txt` doesn't exist, create one by running `pip freeze > requirements.txt`. If the `Procfile` doesn't exist, create it with exactly this line: `web: uvicorn main:app --host 0.0.0.0 --port $PORT`
2. SAFETY CHECK: Make sure a `.gitignore` file exists and includes `.env` so my API key doesn't get pushed to GitHub.
3. GIT PUSH: Push this project to GitHub. My repo URL is: [PASTE YOUR GITHUB REPO URL HERE]. Add the remote, commit all files, and push to the main branch.
4. RENDER ACCOUNT: Tell me to go to render.com, click "Get Started for Free", and sign in with GitHub. No payment info is needed.
5. CREATE WEB SERVICE: Tell me to click "New +" → "Web Service" in the Render dashboard. Then tell me to connect my GitHub repo and fill in these EXACT settings:
   - Name: autoexpert-bot
   - Region: Singapore (Southeast Asia)
   - Branch: main
   - Runtime: Python 3
   - Build Command: pip install -r requirements.txt
   - Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   - Instance Type: Free
   Then click "Deploy Web Service" and wait 2-3 minutes.
6. ADD API KEY (CRITICAL): Once deployed, the site will show a 403 error because it's missing the API key. Tell me to go to my Render service dashboard → click "Environment" in the left sidebar → click "Add Environment Variable" → set Key as `GEMINI_API_KEY` and Value as my actual API key from my `.env` file → click "Save Changes". Render will auto-redeploy.
7. FINAL TEST: My live URL will be https://autoexpert-bot.onrender.com. Tell me to open it and test my chatbot. Remind me that the first load takes ~30 seconds because the free tier sleeps after 15 minutes of inactivity.
```

---

## Option 2: Manual Step-by-Step

### Phase 1: Push to GitHub
1. Create a new repo at [github.com/new](https://github.com/new) (set to **Private**).
2. Run in your terminal:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

### Phase 2: Create Render Account
1. Go to [render.com](https://render.com) → click **"Get Started for Free"**.
2. Click **"Sign in with GitHub"** → Authorize. Done! No payment needed.

### Phase 3: Deploy
1. Click **"New +"** → **"Web Service"**.
2. Connect your GitHub repo. If you don't see it, click **"Configure account"**.
3. Fill in the settings:
   - **Name**: `autoexpert-bot`
   - **Region**: `Singapore (Southeast Asia)` ← closest to India
   - **Branch**: `main`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Scroll down and select **"Free"**
4. Click **"Deploy Web Service"** → Wait 2-3 minutes ⏳

### Phase 4: Add Your API Key
1. In Render dashboard → **"Environment"** (left sidebar).
2. Click **"Add Environment Variable"**.
3. **Key**: `GEMINI_API_KEY` | **Value**: *(your actual API key from `.env`)*
4. Click **"Save Changes"** → Auto-redeploys in ~1 minute.

### Phase 5: You're Live! 🎉
Your URL: **`https://autoexpert-bot.onrender.com`**

> 💡 Free tier sleeps after 15 min of inactivity. First visit takes ~30s to wake up.
