# AGENTS.md - Development Guidelines

This document provides guidelines for AI agents working in this repository.

## Project Overview

This is a personal portfolio repository containing various projects across multiple technologies:
- **Frontend**: JavaScript, TypeScript, React, Next.js, HTML, CSS, Flutter
- **Backend**: Node.js, Python, .NET, Java, C#
- **Database**: MySQL, PostgreSQL
- **Cloud**: AWS, Supabase, Firebase, Railway, Netlify, Vercel

---

## Build / Lint / Test Commands

### Node.js / JavaScript / TypeScript Projects

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run type checking
npm run typecheck

# Run tests
npm test

# Run a single test file
npm test -- --testPathPattern=<filename.test.ts>

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Python Projects

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run linting
ruff check .
black .

# Format code
black .
isort .

# Type checking
mypy .

# Run tests
pytest

# Run a single test
pytest tests/test_file.py::test_function
```

---

## Code Style Guidelines

### General Principles

- Write clean, readable, and maintainable code
- Follow the single responsibility principle
- Keep functions small and focused
- Use meaningful variable and function names
- Avoid magic numbers - use constants
- Comment complex logic, not obvious code

### TypeScript / JavaScript

- **Types**: Always use TypeScript for new projects. Define interfaces for all data structures.
- **Naming**:
  - Variables/functions: camelCase
  - Classes/Types: PascalCase
  - Constants: SCREAMING_SNAKE_CASE
  - Files: kebab-case (e.g., `user-service.ts`)
- **Imports**: Use absolute imports when possible. Group imports in this order:
  1. External libraries (React, Next.js, etc.)
  2. Internal modules (components, hooks, utils)
  3. Relative imports
- **Formatting**: Use Prettier with ESLint
- **Errors**: Use custom error classes, never use `any` type, enable strict mode

### React / Next.js

- Use functional components with hooks
- Name components descriptively (e.g., `UserProfile`, not `Profile`)
- Colocate related files (component + styles + tests)
- Use absolute imports from `@/` or `~/` aliases
- Prefer Server Components where possible in Next.js
- Handle loading and error states explicitly

### Python

- **Naming**:
  - Variables/functions: snake_case
  - Classes: PascalCase
  - Constants: SCREAMING_SNAKE_CASE
- **Imports**: Use absolute imports, sort with isort
- **Types**: Use type hints for all function signatures
- **Formatting**: Follow PEP 8, use Black for formatting
- **Errors**: Use custom exceptions, avoid bare except clauses

### Database

- Use ORM query builders or query builders (Prisma, Drizzle, SQLAlchemy)
- Never concatenate strings for SQL queries - use parameterized queries
- Use migrations for schema changes
- Add indexes for frequently queried columns

---

## Error Handling

- Use try-catch blocks for async operations
- Return appropriate HTTP status codes
- Log errors with context (don't log sensitive data)
- Create custom error classes for domain-specific errors
- Handle errors at the appropriate level (don't swallow exceptions)
- Always validate input data

---

## Git Conventions

- Use meaningful commit messages
- Keep commits atomic and focused
- Create feature branches for new features
- Use conventional commits format: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore

---

## Security Best Practices

- Never commit secrets, API keys, or credentials
- Use environment variables for sensitive configuration
- Sanitize user input to prevent injection attacks
- Use HTTPS for all production connections
- Follow principle of least privilege

---

## Testing Guidelines

- Write tests for business logic and critical paths
- Use AAA pattern (Arrange, Act, Assert)
- Test happy path and error cases
- Mock external dependencies
- Keep tests fast and isolated
- Aim for meaningful test coverage, not just numbers

---

## Documentation

- Document public APIs and exported functions
- Use JSDoc/TypeDoc for TypeScript
- Keep README files updated
- Document complex algorithms and business rules
