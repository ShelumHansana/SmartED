# Quick Setup Script for GitHub Actions

Write-Host "🔥 Setting up GitHub Actions for Firebase Auto-Deploy" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get Service Account
Write-Host "Step 1: Creating service account..." -ForegroundColor Yellow
Write-Host "Opening Google Cloud Console..." -ForegroundColor Gray
Write-Host ""
Write-Host "Please follow these steps:" -ForegroundColor Green
Write-Host "1. A browser window will open to Google Cloud Console"
Write-Host "2. Navigate to: IAM & Admin > Service Accounts"
Write-Host "3. Click 'Create Service Account'"
Write-Host "4. Name: github-actions-smart-ed"
Write-Host "5. Add roles: Firebase Hosting Admin + Service Account User"
Write-Host "6. Create a JSON key and download it"
Write-Host ""

$url = "https://console.cloud.google.com/iam-admin/serviceaccounts?project=smart-ed-b7023"
Start-Process $url

Write-Host "Press ENTER when you have downloaded the JSON key file..." -ForegroundColor Yellow
$null = Read-Host

# Step 2: Instructions for GitHub
Write-Host ""
Write-Host "Step 2: Adding secret to GitHub..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Now, follow these steps:" -ForegroundColor Green
Write-Host "1. Open the downloaded JSON file in a text editor"
Write-Host "2. Copy ALL the contents (the entire JSON object)"
Write-Host "3. Go to: https://github.com/ShelumHansana/SmartED/settings/secrets/actions"
Write-Host "4. Click 'New repository secret'"
Write-Host "5. Name: FIREBASE_SERVICE_ACCOUNT_SMART_ED_B7023"
Write-Host "6. Value: Paste the entire JSON content"
Write-Host "7. Click 'Add secret'"
Write-Host ""

# Open GitHub secrets page
$githubUrl = "https://github.com/ShelumHansana/SmartED/settings/secrets/actions"
Write-Host "Opening GitHub secrets page..." -ForegroundColor Gray
Start-Process $githubUrl

Write-Host ""
Write-Host "Press ENTER when you have added the secret to GitHub..." -ForegroundColor Yellow
$null = Read-Host

# Step 3: Test deployment
Write-Host ""
Write-Host "Step 3: Testing auto-deployment..." -ForegroundColor Yellow
Write-Host ""
Write-Host "The workflow file has been created at:" -ForegroundColor Green
Write-Host ".github/workflows/firebase-deploy.yml"
Write-Host ""
Write-Host "To test the auto-deployment:" -ForegroundColor Green
Write-Host "1. Make a small change to any file"
Write-Host "2. Run: git add ."
Write-Host "3. Run: git commit -m 'Test auto-deployment'"
Write-Host "4. Run: git push origin main"
Write-Host "5. Check: https://github.com/ShelumHansana/SmartED/actions"
Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Your app will now auto-deploy on every push to main branch!" -ForegroundColor Cyan
Write-Host "Live URL: https://smart-ed-b7023.web.app" -ForegroundColor Blue
