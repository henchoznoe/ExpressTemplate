/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/tests/health.routes.test.ts
 * @title Health Check Integration Test
 * @description Integration test for the (GET /) health check endpoint.
 * @last-modified 2025-11-14
 */

// --- Imports ---
import supertest from 'supertest'
import app from '@/app.js'
import pkg from '../../package.json' with { type: 'json' }

// --- Constants ---

// The supertest request agent
const request = supertest(app)
// The API route to be tested.
const ROUTE_TO_TEST = '/'
// Expected HTTP status code for a successful health check.
const HTTP_STATUS_OK = 200
// Expected success message from a successful health check.
// This should match the constant in `src/routes/index.ts`.
const EXPECTED_MESSAGE = 'Health check successful'

// --- Test Suite ---

describe(`GET ${ROUTE_TO_TEST} - Health Check`, () => {
    /**
     * Test case: Verifies that the endpoint returns a 200 OK
     * and the correct application information payload.
     */
    it('should return 200 OK with correct application info', async () => {
        // --- Act ---
        // Perform the GET request to the health check endpoint
        const response = await request.get(ROUTE_TO_TEST)

        // --- Assert ---
        // Check the main response properties
        expect(response.status).toBe(HTTP_STATUS_OK)
        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe(EXPECTED_MESSAGE)

        // Check the 'data' payload
        const data = response.body.data
        expect(data.version).toBe(pkg.version)
        expect(data.node).toBe(process.version)
        expect(data.environment).toBeDefined()
        expect(data.memory).toBeDefined()
        expect(data.uptime).toBeDefined()
        expect(data.timestamp).toBeDefined()
    })
})
