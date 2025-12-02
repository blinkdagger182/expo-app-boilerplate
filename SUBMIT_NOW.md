# 🚀 Submit to TestFlight - Run These Commands

## Your App is Ready! ✅

- ✅ App icon: "Group 3.png" 
- ✅ Bundle ID: `com.riskcreatives.documentai`
- ✅ Environment variables configured
- ✅ Running in simulator

## 📱 Submit to TestFlight (3 Commands)

Open a **new terminal window** and run these commands:

### Command 1: Initialize EAS Project
```bash
cd ~/Developer/document-ai/expo-app-boilerplate
eas project:init
```
**When prompted:** Press `Y` to create the project

---

### Command 2: Build for iOS
```bash
eas build --platform ios --profile production
```

This will:
- Build your app in the cloud (10-15 minutes)
- Show you a URL to track progress
- Ask about credentials (EAS handles this automatically)

**When prompted about credentials:** Press `Y` to let EAS manage them

---

### Command 3: Submit to TestFlight
```bash
eas submit --platform ios --latest
```

You'll need:
1. **Apple ID**: Your Apple Developer account email
2. **App-specific password**: 
   - Go to: https://appleid.apple.com
   - Sign-In and Security → App-Specific Passwords
   - Generate new password
   - Copy and paste when prompted

---

## 🎯 One-Line Alternative (After First Setup)

After the first successful build, you can use:
```bash
eas build --platform ios --profile production --auto-submit
```

---

## 📊 Check Build Status

```bash
# View all builds
eas build:list

# View project info
eas project:info

# Open EAS dashboard
open https://expo.dev
```

---

## ⚠️ Before You Start

Make sure you have:
- [ ] Apple Developer account (Personal Team is fine)
- [ ] Bundle ID registered: `com.riskcreatives.documentai`
  - Register at: https://developer.apple.com/account/resources/identifiers
- [ ] App created in App Store Connect
  - Create at: https://appstoreconnect.apple.com

---

## 🐛 If You Get Errors

### "Bundle identifier not found"
```bash
# Register the bundle ID at:
open https://developer.apple.com/account/resources/identifiers
# Click "+" and register: com.riskcreatives.documentai
```

### "App not found in App Store Connect"
```bash
# Create the app at:
open https://appstoreconnect.apple.com
# Click "+" → New App
# Bundle ID: com.riskcreatives.documentai
# Name: documentAI
```

### "Build failed"
```bash
# Check the logs
eas build:list
# Click on the build URL to see detailed error logs
```

---

## ✨ Success!

Once submitted, you'll receive an email when the build is ready in TestFlight (usually 5-10 minutes after submission).

Your testers can:
1. Install TestFlight from App Store
2. Use the invite link you send them
3. Install and test your app!

---

## 🎉 Quick Start (Copy & Paste)

```bash
cd ~/Developer/document-ai/expo-app-boilerplate
eas project:init
eas build --platform ios --profile production
# Wait for build to complete...
eas submit --platform ios --latest
```
