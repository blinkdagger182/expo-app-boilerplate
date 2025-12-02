# 🚀 Production Deployment Guide

## ✅ Pre-Deployment Checklist

All items verified and ready:

- ✅ **Bundle ID Updated**: `com.riskcreatives.documentai` (in both app.json and iOS native project)
- ✅ **App Name**: `documentAI`
- ✅ **App Icon**: Updated to "Group 3.png" (all instances)
- ✅ **EAS Project**: Initialized (Project ID: 628a405b-1ec4-40af-bd1b-d31beef3dd4c)
- ✅ **Environment Variables**: Configured in eas.json
- ✅ **iOS Native Project**: Bundle ID updated in Xcode project

---

## 🎯 Deploy to Production (2 Steps)

### Step 1: Build for iOS

Run this command in your terminal:

```bash
cd ~/Developer/document-ai/expo-app-boilerplate
eas build --platform ios --profile production
```

**What happens:**
- EAS will ask to set up iOS credentials (press `Y` to let EAS manage them)
- Build starts on EAS servers (takes 10-15 minutes)
- You'll get a URL to track progress
- Build number auto-increments (currently at build #2)

**Expected prompts:**
1. "Generate a new Apple Distribution Certificate?" → Press `Y`
2. "Generate a new Apple Provisioning Profile?" → Press `Y`

---

### Step 2: Submit to TestFlight

After the build completes successfully:

```bash
eas submit --platform ios --latest
```

**You'll need:**
1. **Apple ID**: Your Apple Developer account email
2. **App-Specific Password**: 
   - Generate at: https://appleid.apple.com/account/manage
   - Go to: Sign-In and Security → App-Specific Passwords
   - Click "Generate Password"
   - Copy the password (you'll only see it once)

---

## 🛠️ Alternative: Use the Deploy Script

I've created a helper script:

```bash
cd ~/Developer/document-ai/expo-app-boilerplate
./deploy-production.sh
```

This script will guide you through the deployment process.

---

## 📋 Before First Deployment

Make sure you have these set up in Apple Developer Portal:

### 1. Register Bundle ID
- Go to: https://developer.apple.com/account/resources/identifiers
- Click "+" to add new identifier
- Select "App IDs" → "App"
- Bundle ID: `com.riskcreatives.documentai`
- Description: `documentAI`
- Capabilities: Enable as needed (Push Notifications, etc.)

### 2. Create App in App Store Connect
- Go to: https://appstoreconnect.apple.com
- Click "+" → "New App"
- Platform: iOS
- Name: `documentAI`
- Bundle ID: Select `com.riskcreatives.documentai`
- SKU: `documentai` (or any unique identifier)
- User Access: Full Access

---

## 📊 Monitor Your Build

### Check Build Status
```bash
# List all builds
eas build:list

# View specific build
eas build:view [BUILD_ID]

# Open EAS dashboard
open https://expo.dev/accounts/rizhanruslan/projects/documentai/builds
```

### Build Logs
If the build fails, check the logs:
1. Run `eas build:list`
2. Click on the build URL
3. View detailed logs in the EAS dashboard

---

## 🎉 After Successful Submission

### TestFlight Processing
1. Build appears in App Store Connect (~5-10 minutes)
2. TestFlight processes the build (~5-10 minutes)
3. You'll receive email notifications

### Add Testers
1. Go to: https://appstoreconnect.apple.com
2. Select your app → TestFlight tab
3. Click "Internal Testing" or "External Testing"
4. Add testers by email
5. They'll receive an invite link

### Test the App
1. Testers install TestFlight from App Store
2. Open invite link on their device
3. Install and test your app

---

## 🔄 Subsequent Deployments

After the first successful deployment, it's easier:

```bash
# Build and auto-submit in one command
eas build --platform ios --profile production --auto-submit

# Or build only
eas build --platform ios --profile production

# Then submit latest
eas submit --platform ios --latest
```

---

## 🐛 Troubleshooting

### "Credentials not set up"
Run in interactive mode (without `--non-interactive`):
```bash
eas build --platform ios --profile production
```

### "Bundle identifier already registered"
This is fine! It means the bundle ID exists. Continue with the build.

### "App not found in App Store Connect"
Create the app first at: https://appstoreconnect.apple.com

### "Invalid credentials"
```bash
# Clear credentials and start fresh
eas credentials
# Select iOS → Production → Remove all credentials
# Then rebuild
```

### "Build failed"
Check the logs:
```bash
eas build:list
# Click on the failed build URL to see detailed logs
```

---

## 📱 Build Information

- **Platform**: iOS
- **Profile**: production
- **Bundle ID**: com.riskcreatives.documentai
- **App Name**: documentAI
- **Current Build Number**: 2 (auto-increments)
- **EAS Project**: documentai (@rizhanruslan)

---

## 🎯 Quick Commands Reference

```bash
# Build for production
eas build --platform ios --profile production

# Submit to TestFlight
eas submit --platform ios --latest

# Check build status
eas build:list

# View project info
eas project:info

# Manage credentials
eas credentials

# View build logs
eas build:view [BUILD_ID]
```

---

## ✨ You're Ready!

Everything is configured correctly. Just run:

```bash
cd ~/Developer/document-ai/expo-app-boilerplate
eas build --platform ios --profile production
```

And follow the prompts. Your app will be in TestFlight within 30 minutes! 🚀
