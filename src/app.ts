import type { Application } from 'express';
import express from 'express';

import { setupLogger } from './config/logger.js';
import { setupMiddlewares } from './config/middlewares.js';
import { setupRoutes } from './config/routes.js';
import { setupSwagger } from './config/swagger.js';

const app: Application = express();

setupLogger(app);
setupMiddlewares(app);
setupSwagger(app);
setupRoutes(app);

export default app;
