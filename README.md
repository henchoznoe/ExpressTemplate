# ExpressTemplate

A lightweight, production-ready Express.js template written in TypeScript. This starter includes common best-practices out of the box: structured routing, request validation with Zod, OpenAPI/Swagger docs, centralized logging with Winston, Supabase integration helper, security middlewares, and a friendly DX using `tsx` for development.

---

## About

This repository is a minimal but well-structured Express + TypeScript template intended to bootstrap small APIs or prototypes while keeping sensible defaults for security, validation and observability.

## Features

- **TypeScript-first structure**
- **Zod-based validation** for requests, query params, and environment
- **OpenAPI / Swagger UI** documentation at `/api-docs`
- **Winston logging** with daily rotate files
- **Supabase client wiring** (helper in `src/config/supabase.ts`)
- **Security middlewares**: helmet, cors, hpp, rate limiting, compression
- **Centralized error handling**
- **Developer tooling**: `tsx` for dev runner, Biome for linting & formatting

---

## Requirements

- Node.js 22+ (LTS recommended)
- npm (or compatible package manager)

---

## Getting started

1. Clone the repository:

```bash
git clone https://github.com/henchoznoe/ExpressTemplate.git
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

You should see logs like `Express server ready at: http://localhost:3000` depending on your `PORT` value.

### Production build

Build the project and run the compiled output:

```bash
npm run build
node dist/index.js
```

---

## Deployment (PM2)

This project expects production environment variables to be provided at runtime. For deployments, I recommend creating the `.env.production` file at the project root containing the same keys as your development `.env`, but with production values. Do NOT commit this file.

1. Build and start with the `production` environment:

```bash
npm run build
pm2 start ecosystem.config.js
```

2. To view logs:

```bash
pm2 logs express-template
```

---

## Scripts

The following npm scripts are available (from `package.json`):

- `npm run dev` — Run in development mode using `tsx watch` with environment loading and tsconfig path support.
- `npm run build` — Compile TypeScript to `dist` using `tsc`.
- `npm start` — Run the compiled `dist/index.js` with `tsconfig-paths` registered.
- `npm run lint` — Run Biome linter and auto-fix where possible.
- `npm run format` — Format code with Biome.
- `npm run check` — Run Biome type & config checks.
- `npm run prepare` — Install lefthook git hooks (runs on package install).

---

## Project structure

Main folders and important files:

- `src/`
  - `index.ts` — app entry (starts the HTTP server)
  - `app.ts` — express app setup, middlewares and routes mounting
  - `config/` — app configuration loaders (`env.ts`, `logger.ts`, `supabase.ts`, `openapi.ts`)
  - `controllers/` — HTTP handlers
  - `routes/` — route definitions
  - `services/` — business logic layer
  - `db/` — data access / repositories
  - `middlewares/` — global and validation middlewares
  - `schemas/` — Zod schemas for requests/responses
  - `utils/` — helpers (http responses, errors, etc.)
- `logs/` — rotating log files produced by Winston
- `dist/` — compiled JS after `npm run build`

> Tip: imports use path aliases (configured via `tsconfig`), e.g. `@config/env.js`.

---

## API documentation

OpenAPI documentation is exposed using Swagger UI. Once the server is running, visit:

  http://localhost:3000/api-docs

---

## Logging & Errors

- The project uses Winston with daily rotate files; logs are stored in `logs/`.
- Centralized error handling middleware returns structured HTTP errors. See `src/middlewares/global/error-handler.ts` for the behavior.

---

## License

This project is licensed under ISC. See the `package.json` `license` field for details.

---

## Troubleshooting

- Server exits on startup with environment errors: double-check your `.env` matches the required keys and value formats.
- Port already in use: change `PORT` or kill the process occupying it.
- If Swagger or routes are not visible, confirm the server started successfully and `NODE_ENV` is not preventing docs from loading.
