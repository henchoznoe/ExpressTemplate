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
- **A PostgreSQL Database**: I recommend using Supabase for easy setup.

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
Add unique identifiers for your new classes in `src/types/ioc.types.ts`.

```typescript
// src/types/ioc.types.ts
export const TYPES = {
    // ... existing symbols
    PrismaClient: Symbol.for('PrismaClient'), // Core dependency
    ProductController: Symbol.for('ProductController'),
    ProductService: Symbol.for('ProductService'),
    ProductRepository: Symbol.for('ProductRepository'),
};
```

**2. Create the Logic:**

- **Repository**: Create an interface `IProductRepository` and its implementation `PrismaProductRepository`. Inject the `PrismaClient here.

```typescript
// src/db/products.repository.interface.ts
export interface IProductRepository {
    findAll(): Promise<Product[]>;
}

// src/db/prisma-products.repository.ts
import { injectable, inject } from 'inversify';
import { TYPES } from '@/types/ioc.types';
import type { PrismaClient } from '@prisma/client';

@injectable()
export class PrismaProductRepository implements IProductRepository {
    constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

    async findAll() {
        return this.prisma.product.findMany();
    }
}
```

- **Service** : Create an interface `IProductService` and its implementation `ProductService`. Inject the repository interface here.
- **Controller** : Create `src/controllers/products.controller.ts`. Inject the **service interface** here (not the concrete class).

_Example of injection in the controller:_

```typescript
// src/controllers/products.controller.ts
import { injectable, inject } from 'inversify';
import { TYPES } from '@/types/ioc.types';
import type { IProductService } from '@services/products.service.interface';

@injectable()
export class ProductController {
    constructor(@inject(TYPES.ProductService) private productService: IProductService) {}

    getAll = async (req: Request, res: Response) => {
        const products = await this.productService.getAll();
        res.json(products);
    };
}
```

**3. Bind Dependencies:**
Register your new classes in the IoC container at `src/config/container.ts`.

```typescript
// src/config/container.ts

// Database (already bound)
container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prisma);

// Bind Repository (Interface -> Implementation)
container.bind<IProductRepository>(TYPES.ProductRepository).to(PrismaProductRepository).inSingletonScope();

// Bind Service (Interface -> Implementation)
container.bind<IProductService>(TYPES.ProductService).to(ProductService).inSingletonScope();

// Bind Controller (Concrete class)
container.bind<ProductController>(TYPES.ProductController).to(ProductController).inSingletonScope();
```

**4. Register the Route:**
Finally, define your routes in a new file like `src/routes/products.route.ts` and use the IoC container to get an
instance of your controller.

```typescript
// src/routes/products.route.ts
const productController = container.get<ProductController>(TYPES.ProductController);
router.get('/', productController.getAll);
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
