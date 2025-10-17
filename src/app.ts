import { setupRoutes } from '@config/routes.js'
import { setupSwagger } from '@config/swagger.js'
import { setupMiddlewares } from '@middlewares/index.js'
import express from 'express'

const app = express()

setupMiddlewares(app)
setupSwagger(app)
setupRoutes(app)

export default app
