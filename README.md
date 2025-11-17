# ExpressTemplate

A lightweight, production-ready **Express.js 5** template written in **TypeScript**. This project implements a clean
**Hexagonal/Layered Architecture** with Dependency Injection, robust validation, centralized logging, and a fully
optimized Docker setup.

---

## 🚀 Features

- **Modern Stack**: TypeScript (ESM) with Express 5.
- **Dependency Injection (IoC)**: Managed by `InversifyJS` for loosely coupled, testable code.
- **Database ORM**: Prisma with PostgreSQL (optimized for production).
- **Validation**: Strict request validation using `Zod`.
- **Security**: Pre-configured with `Helmet`, `CORS`, `HPP`, and Rate Limiting.
- **Observability**:
    - **Winston** for structured logging (file rotation & console).
    - **Morgan** for HTTP request logging (piped to Winston).
- **API Documentation**: Auto-generated **OpenAPI / Swagger** docs (`zod-to-openapi`).
- **Dockerized**: Multi-stage build reducing image size by excluding dev dependencies (like the Prisma CLI) in
  production.
- **Developer Experience**:
    - `Biome` for ultra-fast linting and formatting.
    - `Lefthook` for git hooks.
    - Hot-reloading with `tsx`.

---

## 📋 Requirements

- **Node.js**: v22+ (LTS recommended)
- **Docker**: For containerized execution (recommended).
- **A PostgreSQL**

---

## 🛠️ Getting Started

### 1. Setup Environment

Clone the repository and install dependencies:

```bash
git clone https://github.com/henchoznoe/ExpressTemplate.git
cd ExpressTemplate
npm install
```

### 2. Configuration

Rename the example environment file and configure your secrets:

```bash
cp .env.example .env
```

**Important**: Update all necessary environment variables in the `.env` file, especially the database connection string.

### 3. Database Setup (Local)

If you are not using Docker, ensure your Postgres database is running, then apply migrations:

```bash
# Generates the Prisma Client
npx prisma generate

# Pushes schema changes to the database
npx prisma migrate dev --name init
```

### 4. Run the Server

```bash
# Development mode (Hot Reload)
npm run dev

# Production build
npm run build
npm start
```

> The server will start at `http://localhost:3000`.

---

## 🧩 Architecture & Dependency Injection

This project uses **InversifyJS** to manage dependencies through Inversion of Control (IoC). This pattern decouples
components, making the application more modular, easier to test, and simpler to maintain. Instead of a controller
creating its own service instance, the dependency is "injected" by a central container.

### How to Add a New Feature (e.g., "Products")

To maintain the architecture, follow these steps when adding a new feature:

**1. Define Symbols:**
Add unique identifiers for your new classes in `src/types/ioc.types.ts`. These symbols act as keys for the IoC
container.

```typescript
// src/types/ioc.types.ts
export const TYPES = {
    // ... existing symbols
    ProductController: Symbol.for('ProductController'),
    ProductService: Symbol.for('ProductService'),
    ProductRepository: Symbol.for('ProductRepository'),
};
```

**2. Create the Logic:**

- **Repository**: Create `src/db/products.repository.ts` that implements a clear interface (e.g., `IProductRepository`).
  This layer is responsible for all database interactions.
- **Service**: Create `src/services/products.service.ts`. This is where your business logic lives. Inject the repository
  here.
- **Controller**: Create `src/controllers/products.controller.ts`. This layer handles HTTP requests and responses.
  Inject the service here.

*Example of injection in the controller:*

```typescript
// src/controllers/products.controller.ts
import {injectable, inject} from 'inversify';
import {TYPES} from '@/types/ioc.types';
import {ProductService} from '@services/products.service';

@injectable()
export class ProductController {
    constructor(@inject(TYPES.ProductService) private productService: ProductService) {
    }

    // ... controller methods
}
```

**3. Bind Dependencies:**
Register your new classes in the IoC container at `src/config/container.ts`. This tells InversifyJS how to resolve the
dependencies.

```typescript
// src/config/container.ts

// Bind Repository
container.bind<IProductRepository>(TYPES.ProductRepository).to(PrismaProductRepository).inSingletonScope();
// Bind Service
container.bind<ProductService>(TYPES.ProductService).to(ProductService).inSingletonScope();
// Bind Controller
container.bind<ProductController>(TYPES.ProductController).to(ProductController).inSingletonScope();
```

**4. Register the Route:**
Finally, define your routes in a new file like `src/routes/products.route.ts` and use the IoC container to get an
instance of your controller.

```typescript
// src/routes/products.route.ts
import {container} from '@config/container';
import {TYPES} from '@/types/ioc.types';
import {ProductController} from '@controllers/products.controller';

const router = Router();
const productController = container.get<ProductController>(TYPES.ProductController);

router.get('/', productController.getAll); // Assuming getAll is a method on your controller

export default router;
```

Then, add this new router to `src/app.ts`.

---

## 🗄️ Database & Prisma Workflow

We use Prisma as the ORM. Here are the essential commands for managing your database schema.

### Modifying the Schema

1. Edit your schema file at `prisma/schema.prisma`.
2. Create a new migration file and apply the changes to your local database:

```bash
# Creates a new SQL migration file and applies it
npx prisma migrate dev --name your_migration_description
```

This command also automatically regenerates the Prisma Client based on your new schema.

### Regenerating the Client

If you pull changes from Git that include schema updates, you only need to regenerate the typed client:

```bash
npx prisma generate
```

### Production & CI/CD

In a production environment, you should not use `migrate dev`. Instead, apply existing migrations:

```bash
# Applies all pending migrations
npx prisma migrate deploy
```

---

## 🐳 Docker & Deployment

The project includes a multi-stage `Dockerfile` optimized for production to create a small and secure image.

**Key Optimizations:**

- **Builder Stage**: Installs all dependencies (including `devDependencies`) to build the TypeScript code and generate
  the Prisma Client.
- **Production Stage**: Copies only the compiled code (`dist/`), `node_modules` (production-only), and Prisma schema.
  Heavy `devDependencies` like the Prisma CLI are excluded, significantly reducing the final image size.

### Running with Docker Compose

```bash
# Build and start the containers in detached mode
docker compose up -d --build

# View logs
docker compose logs -f

# Stop and remove containers
docker compose down
```

**Note**: Since the Prisma CLI is not included in the production image, `prisma generate` is run during the build phase.
If you change the schema, you **must** rebuild the image.

---

## 📂 Project Structure

```
src/
├── app.ts              # Express app configuration (middlewares, routes)
├── index.ts            # Entry point (server startup)
├── config/             # Configuration (Env, Logger, Container, Prisma)
├── controllers/        # HTTP Request Handlers
├── db/                 # Data Access Layer (Repositories)
├── docs/               # API Documentation (Swagger setup)
├── middlewares/        # Express Middlewares (Global & Route-specific)
├── models/             # Domain Models (Clean Types)
├── routes/             # Route Definitions
├── schemas/            # Zod Validation Schemas
├── services/           # Business Logic
├── types/              # TypeScript Type Definitions (including IoC types)
└── utils/              # Helper functions
```

---

## 📚 API Documentation

Swagger UI is automatically generated from your Zod schemas. Once the server is running, visit:

👉 **http://localhost:3000/api-docs**

---

## ✅ Coding Standards

This project enforces strict coding standards to ensure code quality and consistency.

- **Linting & Formatting**: We use **Biome** for ultra-fast linting and formatting. Run `npm run lint` and
  `npm run format`.
- **Git Hooks**: **Lefthook** is configured to run linting and formatting checks automatically before each commit.
- **Typing**: `any` is strictly forbidden. Use specific types or `unknown`.
- **Comments**: Write JSDoc/comments in English for all non-trivial logic to ensure clarity.

---

## 📜 License

This project is licensed under the ISC License.
