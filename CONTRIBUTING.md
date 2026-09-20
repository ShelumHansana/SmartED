# Contributing to SmartED

Thank you for your interest in contributing to the **SmartED School Management Platform**. Open-source contributions, feature suggestions, and bug reports help make SmartED a dependable platform for educators, administrators, and students.

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/ShelumHansana/SmartED/pulls)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Code of Conduct](https://img.shields.io/badge/Contributor-Covenant-orange.svg?style=flat-square)](CODE_OF_CONDUCT.md)

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can You Contribute?](#how-can-you-contribute)
  - [Reporting Issues & Bugs](#reporting-issues--bugs)
  - [Suggesting Features](#suggesting-features)
  - [Submitting Code Changes](#submitting-code-changes)
- [Local Development Setup](#local-development-setup)
- [Branching Strategy](#branching-strategy)
- [Commit Message Conventions](#commit-message-conventions)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Coding Standards & Best Practices](#coding-standards--best-practices)
  - [React & JavaScript](#react--javascript)
  - [Styling & CSS](#styling--css)
  - [Firebase & State Management](#firebase--state-management)

---

## Code of Conduct

All contributors and maintainers are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any violations or unacceptable conduct to **shelumh5@gmail.com**.

---

## How Can You Contribute?

### Reporting Issues & Bugs
Before creating an issue, search the [Existing Issues](https://github.com/ShelumHansana/SmartED/issues) to ensure it hasn't already been addressed.

When submitting a bug report:
1. Use our [Bug Report Template](https://github.com/ShelumHansana/SmartED/issues/new?template=bug_report.md).
2. Clearly describe the issue and include exact steps to reproduce it.
3. Attach screenshots or console error traces where relevant.
4. Mention your browser, operating system, and user role (e.g., Teacher, Admin).

### Suggesting Features
Have an idea for SmartED?
1. Open an issue using our [Feature Request Template](https://github.com/ShelumHansana/SmartED/issues/new?template=feature_request.md).
2. Outline the educational use case and the specific personas that benefit.
3. Detail proposed interface mockups, APIs, or workflow changes.

### Submitting Code Changes
1. Select an open issue or discuss your proposed change in an issue first.
2. Fork the repository and work on a dedicated feature branch.
3. Adhere to the established code styling and architecture.
4. Submit a Pull Request targeting the `main` branch.

---

## Local Development Setup

### 1. Fork and Clone
```bash
git clone https://github.com/YOUR_USERNAME/SmartED.git
cd SmartED
```

### 2. Install Dependencies
Install dependencies for both frontend and backend modules:

```bash
# Frontend setup
cd frontend
npm install

# Backend setup
cd ../backend
npm install
```

### 3. Environment Configuration
Create a local `.env` file in `frontend/`:

```bash
cd ../frontend
cp .env.example .env
```

Ensure your Firebase credentials in `.env` match your local development project.

### 4. Run Development Server
```bash
npm run dev
```

Your Vite development server will spin up at `http://localhost:5173`.

---

## Branching Strategy

Follow standard git feature-branching conventions:

| Branch Type | Format | Example |
| :--- | :--- | :--- |
| **Features** | `feat/<short-description>` | `feat/parent-notification-bell` |
| **Bug Fixes** | `fix/<short-description>` | `fix/grade-calculation-rounding` |
| **Documentation** | `docs/<short-description>` | `docs/update-deployment-guide` |
| **Performance** | `perf/<short-description>` | `perf/optimize-student-list-query` |
| **Chores / Config** | `chore/<short-description>` | `chore/upgrade-vite-plugin` |

---

## Commit Message Conventions

We adhere to the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard.

### Syntax
```
<type>(<optional scope>): <description>

[optional body]

[optional footer(s)]
```

### Common Types
- `feat`: A new user-facing capability or component
- `fix`: A patch for a bug or defect
- `docs`: Documentation edits only
- `style`: Formatting, missing semicolons, or cosmetic tweaks (no code logic change)
- `refactor`: Restructuring existing code without modifying external behavior
- `perf`: Code modification that boosts speed or lowers memory consumption
- `test`: Adding or maintaining test coverage
- `chore`: Build tool, pipeline, or dependency updates

### Example
```bash
git commit -m "feat(teacher): add CSV export for term test grades"
```

---

## Pull Request Guidelines

1. **Keep PRs Focused**: Avoid bundling unrelated changes into a single pull request.
2. **Follow Templates**: Fill out all sections of the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md).
3. **Verify Locally**:
   - Verify that `npm run build` completes with zero errors in `frontend/`.
   - Ensure lint rules pass and no console warnings remain.
4. **Link Issues**: Reference related issues using GitHub keywords (e.g., `Closes #12`).
5. **Review Feedback**: Respond constructively to review comments and update the branch as needed.

---

## Coding Standards & Best Practices

### React & JavaScript
- Use functional components with standard React Hooks (`useState`, `useEffect`, `useMemo`, `useCallback`).
- Maintain modular, single-responsibility components under `frontend/src/components/`.
- Prefer early returns to keep JSX render logic readable.
- Avoid passing raw inline arrow functions in tight loops where performance is critical.

### Styling & CSS
- Maintain styles in dedicated CSS files or CSS modules under `frontend/src/styles/`.
- Respect responsive breakpoints (mobile, tablet, desktop) as defined in `responsive.css`.
- Ensure appropriate contrast ratios and accessible interactive targets for buttons and inputs.

### Firebase & State Management
- Never perform direct user creation via `auth.createUserWithEmailAndPassword` on the primary Auth instance inside administrative views; utilize `createFirebaseUserWithoutLoggingOut` from `src/utils/firebase.js` to preserve the current session.
- Keep Firestore queries selective using indexes and proper constraints (`where`, `limit`).
- Store global session and user role data in Redux Toolkit slices (`src/store/`).

---

*Thank you for helping build a better education management platform with SmartED!*
