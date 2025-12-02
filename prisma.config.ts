/**
 * @file prisma.config.ts
 * @title Prisma Configuration
 * @description Prisma configuration file for setting up the database connection.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

import { defineConfig, env } from 'prisma/config'

import 'dotenv/config'

export default defineConfig({
    datasource: {
        url: env('DATABASE_URL'),
    },
    migrations: {
        path: 'prisma/migrations',
    },
    schema: 'prisma/schema.prisma',
})
