# ExpressTemplate

A lightweight, production-ready **Express.js 5** template written in **TypeScript**. This project implements a clean
**Hexagonal/Layered Architecture** with Dependency Injection, robust validation, centralized logging, transactional
emailing, and a fully optimized Docker setup.

---

## 🚀 Features

- ⚡ **Modern Stack**: TypeScript (ESM) with Express 5.
- 💉 **Dependency Injection (IoC)**: Managed by `InversifyJS` for loosely coupled, testable code.
- 🗄️ **Database ORM**: Prisma with PostgreSQL (Dockerized setup included).
- ✅ **Validation**: Strict request validation using `Zod`.
- 🔒 **Security**:
    - Pre-configured with `Helmet`, `CORS`, `HPP`, and Rate Limiting.
    - Secure Auth Flow: Mandatory email verification and secure password reset.
- 📧 **Emailing**: Integrated with **Resend** for transactional emails (extensible via `IMailService`).
- 📊 **Observability**:
    - **Winston** for structured logging (file rotation & console).
    - **Morgan** for HTTP request logging (piped to Winston).
- 📚 **API Documentation**: Auto-generated **OpenAPI / Swagger** docs (`zod-to-openapi`).
- 🐳 **Dockerized**: Multi-stage build reducing image size by excluding dev dependencies in production.
- 🛠️ **Developer Experience**:
    - `Biome` for ultra-fast linting and formatting.
    - `Lefthook` for git hooks.
    - Hot-reloading with `tsx`.
- 🧪 **Testing**: Complete testing strategy with **Vitest** and **Supertest** (Unit & E2E tests).

---

## 📋 Requirements

- **Node.js**: v22+ (LTS recommended)
- **Docker**: For containerized execution (optional for development, required for production)
- **PostgreSQL**: Included in Docker setup; if not using Docker, provide your own instance
- **Resend API Key**: For sending emails ([get one for free](https://resend.com))

---

## 🛠️ Getting Started

### 1. Clone & Install

Clone the repository and install dependencies:

```bash
git clone https://github.com/henchoznoe/ExpressTemplate.git
cd ExpressTemplate
npm install
```

### 2. Development Mode (Recommended)
Run the Node.js app on your machine, with the database in Docker.

```bash
# 1. Start the database container
npm run db:up

# 2. Sync the schema (creates tables)
npx prisma migrate dev

# 3. Start the server (Hot Reload)
npm run dev
```

> The server will start at `http://localhost:3000`. API documentation is available at `http://localhost:3000/api-docs`.

**Stop the database when done:**
```bash
npm run db:down
```

### 3. Full Docker Mode (Production Preview)

Run both the app and database inside Docker. Useful to test the final build.

```bash
# Build and start all services
docker compose up --build
```

---

## 🗄️ Database & Prisma Workflow

We use **Prisma** as the ORM. Here is how to manage your schema during development.

**Modifying the Schema**

1. Edit `prisma/schema.prisma`.
2. Create a migration and apply changes:

```bash
npx prisma migrate dev --name describe_your_change
```

> This command automatically regenerates the Prisma Client.

**Resetting the Database**

If you need a fresh start (wipes all data):

```bash
npm run db:reset
```

**Studio UI**

To inspect your data visually:

```bash
npx prisma studio
```

---

## 🚀 Production Deployment

Follow these steps to deploy your application safely.

1. **Build the image**:

The Dockerfile uses a multi-stage build to optimize size and security.

```bash
docker build -t express-template .
```

> Note: `prisma generate` is automatically executed during the build.

2. **Configure Environment**:

Ensure your production environment variables are set.

- `DATABASE_URL`: Must point to your production database (e.g., AWS RDS, or the service name postgres if using Docker Compose).
- `NODE_ENV`: Set to `production`.

3. **Apply Migrations**:

⚠️ Never use `migrate dev` in production (it tries to reset the database). Instead, use the deploy command to apply pending migrations safely:

```bash
npx prisma migrate deploy
```

If running via Docker, execute it inside a temporary container before starting traffic:

```bash
docker run --rm --env-file .env express-template npx prisma migrate deploy
```

---

## 📧 Email Architecture

This template uses an `IMailService` interface to decouple the business logic from the email provider. By default, it implements **Resend**.

- **Interface**: `src/services/mail/mail.service.interface.ts`
- **Implementation**: `src/services/mail/resend.mail.service.ts`

To switch providers (e.g., SendGrid, Nodemailer), simply implement the interface and bind your new class in `src/config/container.ts`.

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

- **Repository**: Create an interface `IProductRepository` and its implementation `PrismaProductRepository`. Inject
  the `PrismaClient here.

```typescript
// src/db/products.repository.interface.ts
export interface IProductRepository {
    findAll(): Promise<Product[]>;
}

// src/db/prisma-products.repository.ts
import {injectable, inject} from 'inversify';
import {TYPES} from '@/types/ioc.types';
import type {PrismaClient} from '@prisma/client';

@injectable()
export class PrismaProductRepository implements IProductRepository {
    constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {
    }

    async findAll() {
        return this.prisma.product.findMany();
    }
}
```

- **Service** : Create an interface `IProductService` and its implementation `ProductService`. Inject the repository
  interface here.
- **Controller** : Create `src/controllers/products.controller.ts`. Inject the **service interface** here (not the
  concrete class).

_Example of injection in the controller:_

```typescript
// src/controllers/products.controller.ts
import {injectable, inject} from 'inversify';
import {TYPES} from '@/types/ioc.types';
import type {IProductService} from '@services/products.service.interface';

@injectable()
export class ProductController {
    constructor(@inject(TYPES.ProductService) private productService: IProductService) {
    }

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

## 🧪 Tests

This project implements a robust testing strategy using **Vitest** and **Supertest**, ensuring reliability from unit
logic to HTTP responses.

### Strategy

1. **Unit Tests** (`src/tests/**/*.service.spec.ts`): Focus on **Services**. We verify business logic in isolation by
   injecting mocked Repositories manually.
2. **Integration/E2E Tests** (`src/tests/**/*.e2e.test.ts`): Focus on **Controllers & Routes**. We boot the Express app
   but use `vi.spyOn()` to intercept calls to the Dependency Injection container's singletons. This allows us to mock
   the database layer (Repositories) while testing the rest of the HTTP chain (Middlewares, Controllers, Zod Validation)
   without requiring a running database.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Generate code coverage report
npm run test:cov
```

---

## 📂 Project Structure

```
prisma/                 # Prisma schema & migrations
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
├── tests/              # Unit & Integration Tests
├── types/              # TypeScript Type Definitions (including IoC types)
└── utils/              # Helper functions
```

---

## 📜 License

This project is licensed under the ISC License.
