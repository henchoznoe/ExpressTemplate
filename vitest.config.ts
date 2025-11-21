/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file vitest.config.ts
 * @title Vitest Configuration
 * @description Configuration for Vitest runner.
 * @last-modified 2025-11-17
 */

import swc from 'unplugin-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [
        tsconfigPaths(),
        swc.vite({
            module: { type: 'es6' },
        }),
    ],
    test: {
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
        },
        env: {
            BCRYPT_SALT_ROUNDS: '10',
            CORS_ALLOWED_HEADERS: 'Content-Type',
            CORS_METHODS: 'GET',
            CORS_ORIGIN: 'http://localhost:3000',
            DATABASE_URL: 'postgresql://test:test@localhost:5432/test_db',
            DIRECT_URL: 'postgresql://test:test@localhost:5432/test_db',
            EMAIL_FROM: 'test@example.com',
            FRONTEND_URL: 'http://localhost:5173',
            JWT_ACCESS_EXPIRES_IN: '15m',
            JWT_ACCESS_SECRET: 'test-access-secret',
            JWT_REFRESH_EXPIRES_IN: '7d',
            JWT_REFRESH_SECRET: 'test-refresh-secret',
            NODE_ENV: 'test',
            PORT: '3000',
            RESEND_API_KEY: 're_test_key',
        },
        environment: 'node',
        globals: true,
        include: ['**/*.spec.ts', '**/*.test.ts'],
    },
})
