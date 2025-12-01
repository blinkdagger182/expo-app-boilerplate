# Environment Variables Setup Guide

## Overview

This application uses environment variables to manage sensitive configuration data like API keys and service URLs. This guide explains how to set them up properly for development, staging, and production environments.

## Quick Start (Development)

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in your actual values** in `.env`:
   - Get Supabase credentials from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
   - Get Superwall keys from: https://superwall.com/dashboard
   - Get Gemini API key from: https://makersuite.google.com/app/apikey

3. **Verify the file is ignored by git:**
   ```bash
   git status .env
   # Should show: "nothing to commit" or not list .env
   ```

## Environment Variables Reference

### Required Variables

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Supabase Dashboard → Settings → API |
| `EXPO_PUBLIC_SUPERWALL_API_KEY_IOS` | Superwall iOS API key | Superwall Dashboard → iOS Settings |
| `EXPO_PUBLIC_SUPERWALL_API_KEY_ANDROID` | Superwall Android API key | Superwall Dashboard → Android Settings |
| `EXPO_PUBLIC_GEMINI_API_KEY` | Google Gemini AI API key | Google AI Studio |

### Variable Naming Convention

- **`EXPO_PUBLIC_`** prefix: Makes variables accessible in the React Native app
- Without this prefix, variables are only available in Node.js build scripts

## Environment-Specific Setup

### Development Environment

1. Use `.env` file (already in `.gitignore`)
2. Contains your personal development credentials
3. Never commit this file

### Staging Environment

For EAS Build staging:

```bash
# Create .env.staging
cp .env.example .env.staging
# Fill with staging credentials
```

In `eas.json`:
```json
{
  "build": {
    "staging": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "your-staging-url",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "your-staging-key"
      }
    }
  }
}
```

### Production Environment

**Option 1: EAS Secrets (Recommended)**

```bash
# Store secrets in EAS
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "your-prod-url"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your-prod-key"
eas secret:create --scope project --name EXPO_PUBLIC_SUPERWALL_API_KEY_IOS --value "your-ios-key"
eas secret:create --scope project --name EXPO_PUBLIC_SUPERWALL_API_KEY_ANDROID --value "your-android-key"
eas secret:create --scope project --name EXPO_PUBLIC_GEMINI_API_KEY --value "your-gemini-key"
```

**Option 2: Environment Variables in eas.json**

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "your-production-url",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "your-production-key"
      }
    }
  }
}
```

## Security Best Practices

### ✅ DO:
- Keep `.env` in `.gitignore`
- Use different credentials for dev/staging/prod
- Rotate API keys regularly
- Use EAS Secrets for production builds
- Document required variables in `.env.example`
- Validate environment variables at app startup

### ❌ DON'T:
- Commit `.env` files to git
- Share API keys in Slack/email
- Use production keys in development
- Hardcode credentials in source code
- Store secrets in app.json or eas.json (use EAS Secrets instead)

## Troubleshooting

### Error: "Missing Supabase environment variables"

**Cause:** `.env` file is missing or variables are not set

**Solution:**
```bash
# Check if .env exists
ls -la .env

# If missing, copy from example
cp .env.example .env

# Edit and add your actual values
nano .env  # or use your preferred editor
```

### Variables not updating after change

**Solution:**
```bash
# Clear Metro bundler cache
npm start -- --clear

# Or for iOS
npm run ios -- --clear

# Or for Android
npm run android -- --clear
```

### EAS Build fails with missing variables

**Solution:**
```bash
# List current secrets
eas secret:list

# Create missing secrets
eas secret:create --scope project --name VARIABLE_NAME --value "value"
```

## Team Onboarding Checklist

When a new developer joins:

- [ ] Clone the repository
- [ ] Copy `.env.example` to `.env`
- [ ] Request development credentials from team lead
- [ ] Fill in `.env` with provided credentials
- [ ] Verify app starts: `npm start`
- [ ] Confirm `.env` is not tracked: `git status`

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/build.yml
env:
  EXPO_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
  EXPO_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

Store secrets in: GitHub Repository → Settings → Secrets and variables → Actions

## Additional Resources

- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [EAS Secrets](https://docs.expo.dev/build-reference/variables/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/api/api-keys)

## Support

If you encounter issues with environment setup:
1. Check this documentation
2. Verify `.env` file exists and has correct format
3. Ensure no trailing spaces in variable values
4. Contact the team lead for credential access
