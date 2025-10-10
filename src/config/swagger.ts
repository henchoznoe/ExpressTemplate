import type {Application} from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

export const setupSwagger = (app: Application) => {
    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(
            swaggerJSDoc({
                definition: {
                    openapi: '3.0.0',
                    info: {
                        title: 'Express Template',
                        version: '1.0.0',
                        description: '...'
                    },
                    components: {
                        securitySchemes: {
                            bearerAuth: {
                                type: 'http',
                                scheme: 'bearer',
                                bearerFormat: 'JWT'
                            }
                        }
                    }
                },
                apis: ['./src/routes/*.ts', './src/routes/*.js']
            })
        )
    );
};
