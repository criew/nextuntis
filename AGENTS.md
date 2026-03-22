# AI Agent Instructions

## Project Overview

nextuntis: Ein Verwaltungssystem für Schulen der neuen Generation.
Contributions from humans and AI agents are equally welcome.

## Architecture

- **Backend:** Java 21 + Spring Boot 3.5 (Gradle 9, Kotlin DSL)
- **Database:** PostgreSQL 18, Liquibase
- **Frontend:** React 19 + TypeScript + Material UI 7 + React Router 7 + Zustand + Vitest + MSW
- **Auth:** Keycloak (OIDC)
- **CI:** GitHub Actions
- **Deployment:** Docker Compose

## Build & Test

```bash
# Backend (from backend/)
./gradlew build
./gradlew test
./gradlew bootRun
./gradlew spotlessCheck
./gradlew spotlessApply

# Frontend (from frontend/)
npm ci
npm run dev
npm run build
npm run lint
npm run test
npm run format:check
npm run format
```

## Dependency Management

- All library and plugin versions MUST be declared in `backend/gradle/libs.versions.toml`
- All dependencies MUST be defined as libraries in the `[libraries]` section and referenced via `libs.*`
- Group related libraries into `[bundles]` where possible
- Never inline a version in `build.gradle.kts`

## API & DTO Convention

- **All API DTOs MUST be generated from the OpenAPI spec** – never write DTO classes by hand
- Changes to request/response schemas start with a spec change, then use the generated DTOs
- Frontend types are also generated from the same spec via `openapi-typescript`

## Code Conventions

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):
`<type>[optional scope]: <description>`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `build`

AI agents must include a `Co-Authored-By` trailer in commits.

### Git Workflow

- Always create a feature branch; never commit directly to `main`
- Branch naming: `feature/<issue-id>_<short-description>`
- Keep PRs focused: one logical change per PR
- When fixing an issue, reference it with `Closes #N` in the PR body

### GitHub Issues

- When creating a GitHub Issue, ALWAYS assign appropriate labels
- Issue titles and descriptions MUST be written in English

### Pull Requests

- No direct pushes to `main` — all changes go through PRs
- PRs must be reviewed before merge
- PR titles and descriptions MUST be written in English
- Use the PR template in `.github/PULL_REQUEST_TEMPLATE.md`

### Pre-Push Checklist

Skip if only updating docs. Before every push:
- Backend formatting + build + test
- Frontend formatting + lint + build + test

## Agent Behavior

- Respond in the language the user writes in
- Do not refactor code unless explicitly asked
- Before creating new files, check if similar patterns already exist
- Prefer small, focused commits
- When fixing a bug, write a test that reproduces it first
- Read `docs/decisions/` for Architecture Decision Records before major changes

## Security

- Never commit secrets, API keys, or credentials
- Use environment variables for configuration
- Do not commit `.env` files
