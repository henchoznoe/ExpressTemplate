import { setupSwagger } from '@config/swagger.js'
import { setupErrorHandler } from '@middlewares/global/error-handler.js'
import { setupMiddlewares } from '@middlewares/index.js'
import { setupRoutes } from '@routes/index.js'
import express from 'express'

const app = express()

setupMiddlewares(app)
setupSwagger(app)
setupRoutes(app)
setupErrorHandler(app)

export default app
