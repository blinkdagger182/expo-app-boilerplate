# 🚀 Deploy to TestFlight - Step by Step

## ✅ What's Already Done

- ✅ App icon changed to "Group 3.png" for all instances
- ✅ Bundle ID updated to: `com.riskcreatives.documentai`
- ✅ EAS CLI installed
- ✅ Environment variables configured in eas.json
- ✅ You're logged in as: rizhanruslan

## 📱 Deploy to TestFlight

### Step 1: Initialize EAS Project

```bash
cd expo-app-boilerplate
eas project:init
```

When prompted:
- **Create project?** → Press `Y` (Yes)

This will add a new project ID to your app.json.

### Step 2: Build for iOS

```bash
eas build --platform ios --profile production
```

This will:
- Build your app in the cloud
- Take about 10-15 minutes
- Show you a link to track progress

### Step 3: Submit to TestFlight

Once the build completes:

```bash
eas submit --platform ios --latest
```

You'll need:
- **Apple ID**: Your Apple Developer account email
- **App-specific password**: Generate one at https://appleid.apple.com
  - Go to: Sign-In and Security → App-Specific Passwords
  - Generate a new password
  - Copy and paste when prompted

### Step 4: Configure in App Store Connect

1. Go to: https://appstoreconnect.apple.com
2. Select your app: **documentAI**
3. Go to: TestFlight tab
4. Add internal testers
5. The build will appear in ~5-10 minutes

## 🎯 Quick Commands

```bash
# Check build status
eas build:list

# View project info
eas project:info

# Submit latest build to TestFlight
eas submit --platform ios --latest

# Build and auto-submit (after first setup)
eas build --platform ios --profile production --auto-submit
```

## 📋 Important Notes

- **Bundle ID**: `com.riskcreatives.documentai` (must match in App Store Connect)
- **Team**: Personal Team (Apple Developer account)
- **First build**: Takes 10-15 minutes
- **Subsequent builds**: 5-10 minutes
- **TestFlight processing**: Additional 5-10 minutes

## 🐛 Troubleshooting

### "Bundle identifier not found"
1. Go to: https://developer.apple.com/account/resources/identifiers
2. Click "+" to register: `com.riskcreatives.documentai`
3. Enable capabilities as needed

### "Missing provisioning profile"
EAS handles this automatically. If issues persist:
```bash
eas credentials
```

### "Build failed"
Check the build logs:
```bash
eas build:list
# Click on the build URL to see detailed logs
```

## 🎉 Success!

Once submitted, you'll receive an email when the build is ready for testing in TestFlight!

Your testers can install TestFlight from the App Store and use the invite link you send them.
