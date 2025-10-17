import type { Application } from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

export const setupSwagger = (app: Application) => {
    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(
            swaggerJSDoc({
                apis: ['./src/routes/*.ts', './src/routes/*.js'],
                definition: {
                    components: {
                        securitySchemes: {
                            bearerAuth: {
                                bearerFormat: 'JWT',
                                scheme: 'bearer',
                                type: 'http',
                            },
                        },
                    },
                    info: {
                        description: '...',
                        title: 'Express Template',
                        version: '1.0.0',
                    },
                    openapi: '3.0.0',
                },
            }),
        ),
    )
}
