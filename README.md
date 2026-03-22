# nextuntis

Ein Verwaltungssystem für Schulen der neuen Generation.

## Quick Start

1. Clone: `git clone https://github.com/criew/nextuntis.git`
2. Copy `.env.example` to `.env` and configure
3. Start: `docker compose up`
4. Open: http://localhost:3000

## Documentation

- [Architecture Decisions](docs/decisions/)
- [Feature Specifications](docs/features/)
- [Contributing Guide](CONTRIBUTING.md)

## Tech Stack

- **Backend:** Java 21, Spring Boot 3.5, Gradle 9 (Kotlin DSL), Liquibase
- **Frontend:** React 19, TypeScript 5.9, Vite 7, Material UI 7
- **Database:** PostgreSQL 18 + Keycloak
- **CI/CD:** GitHub Actions, Docker

## License

Licensed under [GNU AGPL v3](LICENSE).
