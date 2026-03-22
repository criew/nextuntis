# Git Workflow Rules

- Always create a feature branch (`feature/<issue-id>_<description>`); never commit directly to main
- Use Conventional Commits format for all commit messages
- Use the PR template if the project has one (`.github/PULL_REQUEST_TEMPLATE.md`)
- Keep PRs focused: one logical change per PR
- When fixing an issue, reference it with "Closes #N" in the PR body
- All commit messages, PR titles, and issue titles MUST be in English

# Pre-Push Checklist

Skip if only updating docs.
Before every push, ALL of the following must pass locally.

**Backend:**
- Formatting (`./gradlew spotlessCheck`)
- Build + test (`./gradlew build`)

**Frontend:**
- Formatting (`npm run format:check`)
- Lint (`npm run lint`)
- Test + build (`npm run test && npm run build`)

If any step fails, fix the issue before pushing.
