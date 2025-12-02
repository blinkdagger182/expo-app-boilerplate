# Run on Real Device - Quick Guide

## ✅ Easiest Method: Expo Go

### Step 1: Install Expo Go
Download **Expo Go** on your phone:
- **iOS**: [App Store - Expo Go](https://apps.apple.com/app/expo-go/id982107779)
- **Android**: [Play Store - Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Step 2: Start Development Server
```bash
cd expo-app-boilerplate
npx expo start
```

### Step 3: Scan QR Code
- **iOS**: Open Camera app → Point at QR code → Tap notification
- **Android**: Open Expo Go app → Tap "Scan QR Code" → Point at QR code

Your app will load on your device! 🎉

---

## 🔧 Alternative: Development Build (Advanced)

If you need custom native modules, you can build a development client:

### For iOS:
```bash
npx expo run:ios --device
```

### For Android:
```bash
npx expo run:android --device
```

**Note**: Currently there's a known issue with react-native-reanimated 4.1.5 and worklets. Use Expo Go for now.

---

## 📱 Tips

- Make sure your phone and computer are on the **same WiFi network**
- If QR code doesn't work, try typing the URL manually in Expo Go
- Press `r` in terminal to reload the app
- Press `m` to toggle dev menu
- Shake your device to open the dev menu on the phone

## 🐛 Troubleshooting

If you see connection issues:
1. Check both devices are on same network
2. Try `npx expo start --tunnel` (slower but works across networks)
3. Restart the dev server with `npx expo start --clear`
