import { setupLogger } from '@config/logger.js';
import { setupMiddlewares } from '@config/middlewares.js';
import { setupRoutes } from '@config/routes.js';
import { setupSwagger } from '@config/swagger.js';
import type { Application } from 'express';
import express from 'express';

const app: Application = express();

setupLogger(app);
setupMiddlewares(app);
setupSwagger(app);
setupRoutes(app);

export default app;
