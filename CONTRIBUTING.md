# Contributing to SmartED

First off, thank you for considering contributing to SmartED! 🎉 It's people like you that make SmartED such a great tool for education.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by the [SmartED Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

- Make sure you have a [GitHub account](https://github.com/signup)
- Fork the repository on GitHub
- Clone your fork locally
- Create a new branch for your contribution

## How Can I Contribute?

### 🐛 Reporting Bugs

- Use the [bug report template](https://github.com/ShelumHansana/SmartED/issues/new?template=bug_report.md)
- Check if the bug has already been reported
- Include as much detail as possible
- Include steps to reproduce the bug

### ✨ Suggesting Features

- Use the [feature request template](https://github.com/ShelumHansana/SmartED/issues/new?template=feature_request.md)
- Explain the problem your feature would solve
- Describe the solution you'd like to see

### 💻 Code Contributions

1. Look for issues labeled `good first issue` or `help wanted`
2. Comment on the issue to let others know you're working on it
3. Fork and create a branch from `main`
4. Make your changes following our style guidelines
5. Submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/SmartED.git
cd SmartED

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Start development server
cd ../frontend
npm run dev
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) for clear and structured commit messages.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, semicolons, etc.) |
| `refactor` | Code changes that neither fix bugs nor add features |
| `perf` | Performance improvements |
| `test` | Adding or fixing tests |
| `chore` | Maintenance tasks |
| `ci` | CI/CD configuration changes |

### Examples

```
feat(auth): add password strength indicator
fix(dashboard): resolve chart rendering issue on mobile
docs(readme): update installation instructions
style(components): format code with Prettier
```

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Ensure your code follows the project's style guidelines
3. Make sure all existing tests pass
4. Add tests for new functionality
5. Your pull request will be reviewed by maintainers
6. Once approved, it will be merged into `main`

### PR Title Format

Follow the same conventional commit format for PR titles:
```
feat(scope): description of the change
```

## Style Guidelines

### JavaScript/React

- Use functional components with hooks
- Use meaningful variable and function names
- Keep components focused and small
- Use `const` by default, `let` when reassignment is needed
- Destructure props and state

### CSS

- Use component-specific CSS files
- Follow BEM naming convention where applicable
- Use CSS variables for theming
- Ensure responsive design

### File Naming

- Components: `PascalCase.jsx` (e.g., `StudentDashboard.jsx`)
- Styles: Match component name (e.g., `StudentDashboard.css`)
- Utilities: `camelCase.js` (e.g., `validation.js`)
- Hooks: `useHookName.js` (e.g., `useFirestore.js`)

---

Thank you for contributing to SmartED! 🚀
