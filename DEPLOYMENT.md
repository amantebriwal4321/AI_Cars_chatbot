# 🚀 Deployment Guide: Taking Your Chatbot Live

This document contains everything you need to deploy your chatbot to the internet using **Google Cloud Run** for free. You have two options: the **1-Click Auto-Deploy** (using AI), or the **Manual Step-by-Step** method.

---

## Option 1: The "Auto-Deploy" Method (Recommended)

Since you are already using Antigravity (or Claude/Gemini) as your AI coding assistant, you can simply command it to do the entire deployment for you! 

**Instructions:**
1. Make sure you have your Google Cloud Project created at [console.cloud.google.com](https://console.cloud.google.com) and Billing enabled (Free Trial is fine).
2. Copy the entire prompt below.
3. Paste it into your AI assistant's chat window.

### 📋 Copy and Paste this Prompt to your AI Assistant:

```text
I am ready to deploy this chatbot to the internet using Google Cloud Run. Please execute this entire process for me step-by-step:

1. THE BLUEPRINT: Create a `Procfile` in this root directory containing exactly this line: `web: uvicorn main:app --host 0.0.0.0 --port $PORT`. Save the file.
2. CLI CHECK: Check if the `gcloud` CLI is installed on my system. If it is not, give me the exact terminal command to install it, and pause. Tell me to restart my editor after installing.
3. AUTHENTICATION: Once `gcloud` is installed, check if I am logged in. If not, run `gcloud auth login`.
4. PROJECT SETUP: Ask me for my Google Cloud Project ID. Once I provide it, run `gcloud config set project [MY_PROJECT_ID]`.
5. THE LAUNCH: Run the deployment command. Use these exact flags so it doesn't get stuck asking me interactive questions: 
   `gcloud run deploy autoexpert-bot --source . --region asia-south1 --allow-unauthenticated`
6. INJECTING SECRETS (CRITICAL): Once the deployment is successful, it will still be broken because it is missing the API key. Automatically read my `GEMINI_API_KEY` from my local `.env` file and securely inject it into the live server using this command:
   `gcloud run services update autoexpert-bot --update-env-vars GEMINI_API_KEY=[THE_KEY_YOU_FOUND] --region asia-south1`
7. THE RESULT: Provide me with the final, live URL where I can test my chatbot!
```

---

## Option 2: The Manual Step-by-Step Method

If you want to understand exactly how the magic works, follow these steps manually.

### 🛠️ Phase 1: Preparing the "Blueprint"
Google Cloud needs an instruction manual to turn your chatbot on.
1. Create a New File named exactly **`Procfile`** (Capital 'P', no extension).
2. Paste this exact line inside: `web: uvicorn main:app --host 0.0.0.0 --port $PORT`
3. **Save the file!** (Ctrl+S)

### ☁️ Phase 2: Claiming Your Free Google Cloud Land
1. Go to [console.cloud.google.com](https://console.cloud.google.com) and sign in.
2. Activate the **Free Trial** banner at the top if you see it.
3. Create a **New Project** and name it something unique (e.g., `my-chatbot-2026`).

### 🔌 Phase 3: Connecting Your Computer
1. Open Windows PowerShell as an Administrator and run:
   ```powershell
   (New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe"); & $env:Temp\GoogleCloudSDKInstaller.exe
   ```
2. Click through the installer. **When finished, you MUST close VS Code completely and reopen it.**

### 🚀 Phase 4: The Magic Launch
1. Open a terminal in VS Code and log in:
   ```bash
   gcloud auth login
   ```
2. Connect to your project:
   ```bash
   gcloud config set project YOUR-PROJECT-NAME-HERE
   ```
3. Deploy the code:
   ```bash
   gcloud run deploy autoexpert-bot --source .
   ```
*(When asked for a region, pick the number for `asia-south1`. When asked to allow unauthenticated invocations, type `y`.)*

### 🔑 Phase 5: Fixing the 403 API Error
Your site is live, but it doesn't have your Gemini API key yet! Run this command to securely inject it:
```bash
gcloud run services update autoexpert-bot --update-env-vars GEMINI_API_KEY=YOUR_ACTUAL_API_KEY_HERE --region asia-south1
```

Refresh your live URL, and you are officially done! 🎉
