# Security Policy

The SmartED project team places the utmost importance on maintaining the security and privacy of educational institutions, students, teachers, and guardians using this platform.

[![Security Policy](https://img.shields.io/badge/Security-Policy-blue.svg?style=flat-square)](SECURITY.md)
[![Firebase Security](https://img.shields.io/badge/Rules-Firestore%20Enforced-FFCA28?style=flat-square&logo=firebase&logoColor=black)](SECURITY.md)

---

## Supported Versions

Security patches and dependency vulnerability updates are actively released for the following versions of SmartED:

| Version | Supported | Notes |
| :--- | :---: | :--- |
| **1.x (Current)** | Yes | Actively maintained with security and stability patches. |
| **< 1.0.0** | No | Legacy preview releases; please upgrade to current main. |

---

## Reporting a Vulnerability

If you identify a security vulnerability, sensitive data exposure, or authentication bypass within SmartED, we ask that you report it responsibly.

> [!IMPORTANT]
> **Please DO NOT file public GitHub issues for security vulnerabilities.** Public reporting may put production institutions at risk before a patch is ready.

### How to Report

Please email a confidential report directly to our security maintainer:
- **Contact:** `shelumh5@gmail.com`
- **Subject Line:** `[SECURITY] SmartED Vulnerability Report - <Brief Description>`

### Information to Include

To help us triage and reproduce the issue rapidly, please provide:
1. **Type of Vulnerability**: (e.g., authentication bypass, privilege escalation, injection flaw, insecure direct object reference).
2. **Component / Affected Paths**: Exact frontend files, backend services, or Firestore collections affected.
3. **Step-by-Step Reproduction**: Detailed instructions or a minimal Proof of Concept (PoC).
4. **Potential Impact**: Explanation of how the flaw could affect users, roles, or institutions.
5. **Mitigation Suggestions**: If you have identified a fix, feel free to include recommendations.

---

## Response Timeline

We commit to the following response targets:

| Milestone | Target Response Window |
| :--- | :--- |
| **Initial Acknowledgment** | Within **48 hours** of report receipt |
| **Triage & Validation** | Within **5 business days** |
| **Status Updates** | Bi-weekly or upon major progress milestones |
| **Patch & Release** | Within **14 business days** (depending on severity) |
| **Public Disclosure** | Mutually agreed upon date following patch deployment |

---

## Security Architecture & Best Practices

SmartED enforces multiple security layers to protect educational records:

### 1. Authentication & Role Separation
- Firebase Authentication manages identity tokens.
- User sessions are verified against assigned roles stored in Cloud Firestore.
- Administrative user generation is segregated through isolated secondary application instances to prevent session hijacking or involuntary logouts.

### 2. Firestore Security Rules
- Granular read and write permissions enforce student and parent data segregation.
- Only authorized teachers and administrators are granted write access to grades, classes, and course curricula.

### 3. Credential & Environment Protection
- Private keys, service account JSON files, and API secrets are never committed to the repository.
- GitHub Actions CI/CD uses encrypted repository secrets (`FIREBASE_SERVICE_ACCOUNT_SMART_ED_B7023`).

### 4. Input Validation & Data Hygiene
- All client-side form submissions are sanitized and validated before transmission to cloud services.
- Data structures are normalized to prevent NoSQL injection or malformed payload injection.

---

*Thank you for helping us maintain a safe, trusted platform for educational communities.*
