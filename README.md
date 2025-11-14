# ExpressTemplate

A lightweight, production-ready Express.js 5 template written in TypeScript. This starter includes common best-practices out of the box: a
clean project structure, Zod validation, integrated testing with Vitest, OpenAPI docs, centralized logging, security middlewares, and a
fully-containerized Docker setup.

---

## About

This repository is a minimal but well-structured Express + TypeScript template intended to bootstrap small APIs or prototypes while keeping
sensible defaults for security, validation, testing, and observability.

---

## Features

- **Modern Stack**: TypeScript (ESM) with Express 5.
- **Zod-based Validation**: For request bodies (`req.body`) and environment variables (`.env`).
- **Robust Error Handling**:
    - Leverages **Express 5's native async error handling** (no `try...catch` needed in controllers).
    - Custom `AppError` class for all operational errors.
    - Database repository intelligently translates DB errors (e.g., unique constraints) into semantic 4xx `AppError` instances.
- **Testing Included**: Pre-configured with **Vitest** for unit tests and **Supertest** for integration tests.
- **Containerized**:
    - Optimized, multi-stage `Dockerfile` for a small, fast production image.
    - `docker-compose.yml` for easy local development and orchestration.
- **Observability**:
    - **Winston** logging with daily rotate files (stored in `logs/`).
    - **OpenAPI / Swagger UI** documentation automatically generated from Zod schemas at `/api-docs`.
- **Security**: Includes `helmet`, `cors`, `hpp` (HTTP Parameter Pollution), rate limiting, and `compression` middlewares.
- **Database**: Includes a `Supabase` client helper (`src/config/supabase.ts`) for easy integration.
- **Developer Experience (DX)**:
    - `tsx` for a fast, zero-config TypeScript development server with hot-reload.
    - `Biome` for extremely fast linting and formatting.
    - `Lefthook` configured for pre-commit hooks (lint, format, type-check).
    - `tsconfig.json` path aliases (e.g., `@config/*`) pre-configured.

---

## Requirements

- Node.js 22+ (LTS recommended)
- npm (or compatible package manager)
- Docker

---

## Local Development (Without Docker)

1. Clone the repository:
   ```bash
   git clone [https://github.com/henchoznoe/ExpressTemplate.git](https://github.com/henchoznoe/ExpressTemplate.git)
   cd ExpressTemplate
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Rename the `.env.example` file to `.env` and fill in the required environment variables.
4. Start the development server:
   ```bash
   npm run dev
   ```
   The server will be accessible at `http://localhost:3000` (or your configured `PORT`).

## Running with Docker

This is the recommended way to run the application in a production-like environment.

1. **Ensure Docker is running**
2. **Create your environment file**: Copy `.env.example` to `.env` (if not already done) and fill in the variables.
   ```bash
   cp .env.example .env
   # Now, edit .env with your values
   ```
   > Note: The `docker-compose.yml` file dynamically uses the `PORT` variable from your `.env` file (defaulting to 3000).
3. **Build and run the container:**
   ```bash
   docker compose build
   docker compose up -d
   ```
   The API will be accessible at `http://localhost:3000` (or your configured `PORT`).

**Useful Docker commands**:

- `docker compose logs -f`: View live logs from the container
- `docker compose down`: Stop and remove the container
- `docker compose build --no-cache`: Force a full rebuild of the image.

---

## Scripts

The following npm scripts are available (from `package.json`):

- `npm run dev` — Run in development mode using `tsx watch`.
- `npm run build` — Compile TypeScript to `dist/` using `tsc`.
- `npm run start` — Run the compiled `dist/index.js` (production mode).
- `npm test` — Run the full test suite (Vitest).
- `npm run test:watch` — Run tests in interactive watch mode.
- `npm run lint` — Run Biome linter and auto-fix where possible.
- `npm run format` — Format code with Biome.
- `npm run check` — Run Biome type & config checks.
- `npm run prepare` — Install lefthook git hooks (runs on package install).

---

## Project structure

- `src/`
    - `index.ts` — App entry (starts the HTTP server)
    - `app.ts` — Express app setup, middlewares and routes mounting
    - `config/` — App configuration (`env.ts`, `logger.ts`, `supabase.ts`, `openapi.ts`)
    - `controllers/` — HTTP handlers (logic for routes)
    - `db/` — Database access / repositories
    - `middlewares/` — Global and validation middlewares
    - `routes/` — Route definitions
    - `schemas/` — Zod schemas for requests/responses
    - `services/` — Business logic layer
    - `tests/` — Test files (`*.test.ts`)
    - `types/` — Custom TypeScript types and interfaces
    - `utils/` — Helper functions (e.g., `http-responses.ts`)
- `logs/` — Rotating log files produced by Winston
- `dist/` — Compiled JS after `npm run build`

> Tip: imports use path aliases (configured via `tsconfig`), e.g. `@config/env.js`.

---

## API documentation

OpenAPI documentation is exposed using Swagger UI. Once the server is running, visit:

http://localhost:3000/api-docs

---

## Logging & Errors

- The project uses **Winston** with daily rotate files; logs are stored in `logs/` (`-app.log` and `-error.log`).
- Centralized error handling middleware (`src/middlewares/global/error-handler.ts`) leverages **Express 5's native async error handling**.
- The database repository (`src/db/supabase-users.repository.ts`) intelligently translates database-specific errors (e.g., unique constraints) into
  custom `AppError` classes, ensuring clean 4xx/5xx responses.

---

## License

This project is licensed under ISC. See the `package.json` `license` field for details.
