# 🚀 Quick Environment Setup

## First Time Setup (2 minutes)

```bash
# 1. Copy the example file
cp .env.example .env

# 2. Open .env in your editor
nano .env  # or code .env, vim .env, etc.

# 3. Replace placeholder values with your actual credentials
```

## Where to Get Your Credentials

### Supabase (Required)
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to: Settings → API
4. Copy:
   - `Project URL` → `EXPO_PUBLIC_SUPABASE_URL`
   - `anon/public key` → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Superwall (Required for payments)
1. Go to: https://superwall.com/dashboard
2. Select your project
3. Go to: Settings → API Keys
4. Copy:
   - iOS API Key → `EXPO_PUBLIC_SUPERWALL_API_KEY_IOS`
   - Android API Key → `EXPO_PUBLIC_SUPERWALL_API_KEY_ANDROID`

### Google Gemini AI (Required for AI features)
1. Go to: https://makersuite.google.com/app/apikey
2. Create or select an API key
3. Copy → `EXPO_PUBLIC_GEMINI_API_KEY`

## Verify Setup

```bash
# Run validation script
node scripts/validate-env.js

# Start the app
npm start
```

## ⚠️ Security Reminders

- ✅ `.env` is already in `.gitignore`
- ❌ Never commit `.env` to git
- ❌ Never share API keys in Slack/Discord
- ✅ Use different keys for dev/staging/prod

## Need Help?

See full documentation: [docs/ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md)
