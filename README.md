# documentAI - React Native App

AI-powered document processing app connected to your Cloudflare Worker backend.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Install iOS pods
cd ios && pod install && cd ..

# 3. Start the app
npm start

# 4. Press 'i' to open iOS simulator
```

## 🔗 Backend

**Connected to:** `https://document-ai-backend.azhanrizhan.workers.dev`

To use local backend, edit `src/config/api.ts`:
```typescript
endpoint: 'http://localhost:8787'
```

## 📱 How It Works

1. User uploads PDF or image
2. Backend processes with OCR (Google Cloud Vision)
3. AI extracts fields and generates UI schema
4. App renders dynamic form components
5. User fills form and submits

## 🎯 Features

- ✅ Upload PDF/images (max 50MB)
- ✅ Real-time progress tracking
- ✅ OCR text extraction
- ✅ Dynamic UI rendering (titles, paragraphs, tables, inputs, buttons)
- ✅ Form handling with state management
- ✅ Beautiful gradient UI

## 📂 Key Files

```
src/
├── config/api.ts              # Backend endpoint configuration
├── api/
│   ├── upload.ts             # Upload + process in single request
│   └── processDocument.ts    # Schema conversion
├── components/
│   ├── DynamicRenderer.tsx   # Renders backend UI schema
│   └── dynamic/              # UI components (Title, Table, Input, etc)
└── screens/
    └── HomeScreen.tsx        # Main upload interface
```

## 🧪 Test Backend

```bash
curl https://document-ai-backend.azhanrizhan.workers.dev/health
```

## 🚀 Deploy to TestFlight

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Update bundle ID in app.json
# "bundleIdentifier": "com.yourcompany.documentai"

# Build
eas build --platform ios --profile production

# Submit
eas submit --platform ios
```

## 🐛 Troubleshooting

**Native module error?**
```bash
cd ios && pod install && cd ..
npm start
```

**Metro bundler issues?**
```bash
npm start -- --clear
```

**Backend not responding?**
```bash
curl https://document-ai-backend.azhanrizhan.workers.dev/health
```

## 📊 Tech Stack

- React Native 0.76.7
- Expo 52.0.35
- TypeScript 5.3.3
- Expo Router 4.0.17
- expo-document-picker
- expo-image-picker

## 🎉 Status

✅ Backend connected  
✅ OCR processing ready  
✅ Dynamic UI working  
✅ Ready to deploy

---

**Start testing:** `npm start` → Press `i` → Upload a document! 🚀
