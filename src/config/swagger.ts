import type { Application } from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

export const setupSwagger = (app: Application) => {
    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(
            swaggerJSDoc({
                apis: ['src/routes/**/*.ts', 'dist/routes/**/*.js'],
                definition: {
                    info: {
                        description: 'Basic Express Template with TypeScript',
                        title: 'Express Template',
                        version: '1.0.0',
                    },
                    openapi: '3.0.0',
                },
            }),
        ),
    )
}
