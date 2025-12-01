# Production Environment Variables Implementation Guide

## 🎯 Implementation Steps for Production Company

This guide provides the complete process for implementing secure environment variable management in a production React Native/Expo application.

---

## Phase 1: Immediate Actions (Do This Now)

### Step 1: Verify .env is Not in Git History

```bash
# Check if .env was ever committed
git log --all --full-history -- .env

# If it shows commits, you need to remove it from history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: coordinate with team first)
git push origin --force --all
```

### Step 2: Rotate All Exposed API Keys

**If .env was ever committed to git:**

1. **Supabase:**
   - Go to Supabase Dashboard → Settings → API
   - Generate new anon key (this will invalidate the old one)
   - Update RLS policies if needed

2. **Superwall:**
   - Contact Superwall support to rotate keys
   - Update in dashboard

3. **Gemini API:**
   - Go to Google AI Studio
   - Delete compromised key
   - Create new key

### Step 3: Update Your Local .env

```bash
# Your .env should already exist with real values
# Just verify it's not tracked
git status .env
# Should show: "nothing to commit" or not appear

# If it appears as tracked, remove it
git rm --cached .env
git commit -m "Remove .env from tracking"
```

---

## Phase 2: Team Implementation (Next 24 Hours)

### Step 4: Team Communication

**Send this message to your team:**

```
🔒 SECURITY UPDATE: Environment Variables

We've implemented secure environment variable management.

ACTION REQUIRED:
1. Pull latest changes: git pull
2. Copy template: cp .env.example .env
3. Get credentials from [SECURE_LOCATION]
4. Fill in your .env file
5. Verify: npm run validate-env
6. Start app: npm start

DO NOT:
- Commit .env file
- Share API keys in Slack/email
- Use production keys locally

Questions? See: docs/ENVIRONMENT_SETUP.md
```

### Step 5: Set Up Credential Management

**Option A: Use a Password Manager (Recommended)**
- Store credentials in 1Password/LastPass/Bitwarden
- Create a shared vault for the team
- Document which credentials go where

**Option B: Use a Secrets Management Service**
- AWS Secrets Manager
- HashiCorp Vault
- Azure Key Vault

### Step 6: Document Credential Access

Create a document (NOT in git) with:
- Who has access to production credentials
- Where credentials are stored
- How to request access
- Rotation schedule

---

## Phase 3: CI/CD Integration (This Week)

### Step 7: GitHub Actions Setup

```yaml
# .github/workflows/validate.yml
name: Validate Environment

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Validate env template
        run: |
          # Check .env.example exists
          if [ ! -f .env.example ]; then
            echo "❌ .env.example is missing"
            exit 1
          fi
          
          # Check .env is not committed
          if git ls-files --error-unmatch .env 2>/dev/null; then
            echo "❌ .env should not be committed"
            exit 1
          fi
          
          echo "✅ Environment setup is valid"
```

### Step 8: EAS Build Configuration

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure secrets for production
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "YOUR_PROD_URL" --type string
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "YOUR_PROD_KEY" --type string
eas secret:create --scope project --name EXPO_PUBLIC_SUPERWALL_API_KEY_IOS --value "YOUR_IOS_KEY" --type string
eas secret:create --scope project --name EXPO_PUBLIC_SUPERWALL_API_KEY_ANDROID --value "YOUR_ANDROID_KEY" --type string
eas secret:create --scope project --name EXPO_PUBLIC_GEMINI_API_KEY --value "YOUR_GEMINI_KEY" --type string

# Verify secrets
eas secret:list
```

### Step 9: Update eas.json

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_ENV": "development"
      }
    },
    "staging": {
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_ENV": "staging"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_ENV": "production"
      }
    }
  }
}
```

---

## Phase 4: Monitoring & Maintenance (Ongoing)

### Step 10: Set Up Monitoring

**Add to your monitoring dashboard:**
- Alert if .env appears in git commits
- Track API key usage/quotas
- Monitor for unauthorized access

**Sentry Integration:**
```typescript
// src/config/sentry.ts
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: process.env.EXPO_PUBLIC_ENV || 'development',
  beforeSend(event) {
    // Remove sensitive data from error reports
    if (event.request) {
      delete event.request.headers;
    }
    return event;
  },
});
```

### Step 11: Key Rotation Schedule

**Set up quarterly rotation:**

| Service | Rotation Frequency | Owner | Next Rotation |
|---------|-------------------|-------|---------------|
| Supabase | Every 90 days | DevOps Lead | [DATE] |
| Superwall | Every 90 days | Backend Lead | [DATE] |
| Gemini API | Every 90 days | AI Lead | [DATE] |

**Rotation Process:**
1. Generate new key in service dashboard
2. Update EAS secrets: `eas secret:create --force`
3. Update team's .env files (via secure channel)
4. Deploy new build
5. Verify old key is revoked
6. Document in rotation log

### Step 12: Security Audit Checklist

Run this monthly:

```bash
# Check for exposed secrets in git history
git log --all --full-history --source --all -- .env

# Check for hardcoded secrets in code
grep -r "pk_" src/
grep -r "sk_" src/
grep -r "eyJ" src/  # JWT tokens

# Verify .gitignore is working
git check-ignore .env
# Should output: .env

# Check for secrets in dependencies
npm audit

# Validate environment setup
npm run validate-env
```

---

## Phase 5: Disaster Recovery (Prepare Now)

### Step 13: Create Incident Response Plan

**If API keys are leaked:**

1. **Immediate (< 5 minutes):**
   - Revoke compromised keys in service dashboards
   - Deploy emergency build with new keys
   - Alert team via emergency channel

2. **Short-term (< 1 hour):**
   - Audit access logs for unauthorized usage
   - Generate new keys
   - Update all environments
   - Document incident

3. **Long-term (< 24 hours):**
   - Review how leak occurred
   - Update security procedures
   - Train team on prevention
   - Consider additional security measures

### Step 14: Backup & Recovery

```bash
# Create encrypted backup of production secrets
# Store in secure location (NOT in git)

# Example using GPG
cat > production-secrets.txt << EOF
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
EOF

gpg --symmetric --cipher-algo AES256 production-secrets.txt
rm production-secrets.txt

# Store production-secrets.txt.gpg in secure location
# Document decryption process for authorized personnel
```

---

## Verification Checklist

Before considering this complete, verify:

- [ ] `.env` is in `.gitignore`
- [ ] `.env` is not in git history
- [ ] `.env.example` has no real credentials
- [ ] All team members have local `.env` files
- [ ] `npm run validate-env` passes
- [ ] EAS secrets are configured
- [ ] CI/CD validates environment setup
- [ ] Monitoring is in place
- [ ] Rotation schedule is documented
- [ ] Incident response plan exists
- [ ] Team is trained on security practices

---

## Common Pitfalls to Avoid

1. **❌ Committing .env "just this once"**
   - Never do this, even for "testing"

2. **❌ Sharing keys via Slack/email**
   - Use secure password manager

3. **❌ Using production keys in development**
   - Always use separate credentials

4. **❌ Forgetting to rotate keys**
   - Set calendar reminders

5. **❌ Not validating on CI/CD**
   - Catches issues before production

6. **❌ Hardcoding fallback values**
   - We removed these - keep them removed

---

## Additional Resources

- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [EAS Secrets Documentation](https://docs.expo.dev/build-reference/variables/)
- [12-Factor App Methodology](https://12factor.net/config)

---

## Support Contacts

- **Security Issues:** [security@yourcompany.com]
- **DevOps Lead:** [devops-lead@yourcompany.com]
- **On-Call Engineer:** [oncall@yourcompany.com]

---

**Last Updated:** [DATE]
**Next Review:** [DATE + 90 days]
**Document Owner:** [NAME]
