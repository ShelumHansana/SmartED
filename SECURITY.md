# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 1.x.x   | ✅ Yes             |

## Reporting a Vulnerability

If you discover a security vulnerability within SmartED, please send an email to **shelumh5@gmail.com**.

**Please do NOT report security vulnerabilities through public GitHub issues.**

### What to include

- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Steps to reproduce the issue
- Impact of the vulnerability

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Assessment**: Within 1 week
- **Fix**: Depending on severity, typically within 2 weeks

## Security Best Practices

When contributing to SmartED:

- Never commit API keys, secrets, or credentials
- Use environment variables for sensitive configuration
- Follow Firebase security rules best practices
- Validate all user inputs on both client and server side
- Keep dependencies updated to patch known vulnerabilities

## Firebase Security

SmartED uses Firebase security rules to protect data. Please ensure:

- Firestore rules enforce role-based access control
- Authentication tokens are validated server-side
- Sensitive user data is properly encrypted
