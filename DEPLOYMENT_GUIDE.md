# GitHub Actions Auto-Deploy Setup Guide

## Prerequisites
- GitHub repository: https://github.com/ShelumHansana/SmartED
- Firebase project: smart-ed-b7023
- Firebase CLI installed and logged in

## Step 1: Create Firebase Service Account

Run this command in your terminal to create a service account key:

```bash
firebase login:ci
```

This will:
1. Open your browser for authentication
2. Generate a CI token
3. Display the token in your terminal

**IMPORTANT:** Copy this token - you'll need it for GitHub secrets!

## Step 2: Add Secret to GitHub

1. Go to your GitHub repository: https://github.com/ShelumHansana/SmartED
2. Click on **Settings** (top menu)
3. In the left sidebar, click **Secrets and variables** > **Actions**
4. Click **New repository secret**
5. Add the following secret:
   - **Name:** `FIREBASE_SERVICE_ACCOUNT_SMART_ED_B7023`
   - **Value:** Paste the entire JSON service account key (see Step 3)

## Step 3: Generate Service Account Key (Alternative Method)

If the CI token method doesn't work, use Google Cloud Console:

1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts?project=smart-ed-b7023
2. Click **Create Service Account**
3. Name: `github-actions-smart-ed`
4. Click **Create and Continue**
5. Add roles:
   - **Firebase Hosting Admin**
   - **Service Account User**
6. Click **Continue** > **Done**
7. Click on the created service account
8. Go to **Keys** tab
9. Click **Add Key** > **Create new key**
10. Choose **JSON** format
11. Click **Create** - this downloads a JSON file
12. Open the JSON file and copy ALL contents
13. Paste it as the GitHub secret value

## Step 4: Verify Workflow File

The workflow file is already created at:
`.github/workflows/firebase-deploy.yml`

This workflow will:
- ✅ Trigger on every push to `main` branch
- ✅ Trigger on pull requests to `main` branch
- ✅ Install dependencies
- ✅ Build the frontend
- ✅ Deploy to Firebase Hosting automatically

## Step 5: Test the Auto-Deployment

1. Make a small change to any file
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Test auto-deployment"
   git push origin main
   ```
3. Go to GitHub repository > **Actions** tab
4. Watch the deployment progress
5. Once complete, check your live site: https://smart-ed-b7023.web.app

## Troubleshooting

### If deployment fails:
1. Check GitHub Actions logs for errors
2. Verify the service account key is correctly added to secrets
3. Ensure the secret name matches: `FIREBASE_SERVICE_ACCOUNT_SMART_ED_B7023`
4. Check Firebase permissions for the service account

### Common Issues:
- **"Permission denied"**: Service account needs Firebase Hosting Admin role
- **"Project not found"**: Check projectId in firebase.json
- **"Build failed"**: Check build errors in Actions logs

## What Happens on Each Push

```
You push code → GitHub Actions triggered
                       ↓
              Checkout repository
                       ↓
              Install Node.js 20
                       ↓
              Install dependencies
                       ↓
              Build React app (npm run build)
                       ↓
              Deploy to Firebase Hosting
                       ↓
              🎉 Live at https://smart-ed-b7023.web.app
```

## Manual Deployment (Backup Method)

If auto-deployment is not set up, you can always deploy manually:

```bash
cd D:\SmartED\frontend
npm run build
cd ..
firebase deploy --only hosting
```

---

**Created:** November 20, 2025
**Project:** SmartED School Management System
**Firebase Project:** smart-ed-b7023
**GitHub Repo:** ShelumHansana/SmartED
