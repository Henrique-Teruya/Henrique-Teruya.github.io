# GEMINI.md - Instructional Context for HenriqueTeruyaDev Portfolio

This file provides instructional context for AI agents interacting with the `HenriqueTeruyaDev` repository.

## Project Overview

This is the personal portfolio and developer profile repository of **Henrique Teruya**, a Fullstack Developer based in São Paulo, SP. The repository serves as a hub for projects, studies, experiments, and standardized development guidelines.

### Core Technologies

Henrique works across the full stack, with expertise in:

- **Front-End**: JavaScript, TypeScript, React, Next.js, HTML, CSS, Flutter.
- **Back-End**: Node.js, Python, .NET, Java, C#.
- **Database**: SQL (MySQL, PostgreSQL), Power BI, Excel.
- **Cloud & Infrastructure**: AWS (S3, EC2, Lambda, DynamoDB, PostgreSQL), Supabase, Firebase, Railway, Netlify, Vercel.
- **Tools**: GitHub, GitLab.

## Key Files

- **`README.md`**: Provides a high-level overview of Henrique's profile, technologies, work focus, and contact information.
- **`AGENTS.md`**: **CRITICAL REFERENCE.** Contains exhaustive development guidelines, coding styles, build/test commands, and security best practices for all supported tech stacks (Node.js, Python, React, etc.).

## Development & Interaction Guidelines

When working in this repository or on projects associated with Henrique Teruya:

1.  **Strict Adherence to `AGENTS.md`**: All code changes, new features, and bug fixes MUST strictly follow the conventions outlined in `AGENTS.md`. This includes naming conventions, file structures, and testing patterns.
2.  **Tech Stack Specifics**:
    *   **TypeScript/JavaScript**: Always use TypeScript for new projects. Use functional components for React/Next.js.
    *   **Python**: Follow PEP 8, use type hints, and employ Black for formatting.
    *   **General**: Prioritize clean, readable, and maintainable code with meaningful naming.
3.  **Security**: Never commit secrets, API keys, or credentials. Use environment variables and follow the principle of least privilege.
4.  **Testing**: Always include tests for business logic and critical paths. Follow the AAA (Arrange, Act, Assert) pattern.
5.  **Git Conventions**: Use meaningful, atomic commits following the `type(scope): description` format.

## Usage

AI agents should use this repository as a reference for Henrique's technical standards. When tasked with creating or modifying code within this environment, the agent must first consult `AGENTS.md` to ensure the proposed solution aligns with the established architectural and stylistic patterns.
