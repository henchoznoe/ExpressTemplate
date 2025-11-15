import { defineConfig, env } from 'prisma/config'

import 'dotenv/config'

export default defineConfig({
    datasource: {
        directUrl: env('DIRECT_URL'),
        url: env('DATABASE_URL'),
    },
    engine: 'classic',
    migrations: {
        path: 'prisma/migrations',
    },
    schema: 'prisma/schema.prisma',
})
