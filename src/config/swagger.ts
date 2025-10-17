import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'
import registry from '@config/openapi.js'
import type { Application } from 'express'
import swaggerUi from 'swagger-ui-express'

export const setupSwagger = (app: Application) => {
    const generator = new OpenApiGeneratorV3(registry.definitions)
    const openApiDoc = generator.generateDocument({
        info: { description: 'Basic Express Template', title: 'Express TypeScript API', version: '1.0.0' },
        openapi: '3.0.0',
    })
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDoc))
}
