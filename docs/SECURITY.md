# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please email security@yourcompany.com immediately. Do not create a public GitHub issue.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Security Best Practices

### Environment Variables

- **Never commit `.env` files** - They contain sensitive credentials
- **Use `.env.example`** - Template for team members (no real credentials)
- **Rotate keys quarterly** - See docs/PRODUCTION_ENV_IMPLEMENTATION.md
- **Use EAS Secrets** - For production builds

### API Keys

- **Supabase:** Use Row Level Security (RLS) policies
- **Superwall:** Keep keys secure, rotate regularly
- **Gemini API:** Monitor usage, set quotas

### Code Security

- Run `npm audit` regularly
- Keep dependencies updated
- Use TypeScript strict mode
- Validate all user inputs

## Security Checklist

Before deploying:

- [ ] No secrets in git history
- [ ] `.env` is in `.gitignore`
- [ ] All API keys are rotated if previously exposed
- [ ] RLS policies are enabled on all tables
- [ ] Environment validation passes: `npm run validate-env`
- [ ] Security audit passes: `npm audit`

## Incident Response

If credentials are compromised:

1. **Immediately revoke** the compromised keys
2. **Generate new keys** in service dashboards
3. **Update EAS secrets**: `eas secret:create --force`
4. **Deploy emergency build**
5. **Document incident** in security log
6. **Review and improve** security procedures

## Contact

- Security Team: security@yourcompany.com
- DevOps Lead: devops@yourcompany.com
- Emergency: oncall@yourcompany.com
