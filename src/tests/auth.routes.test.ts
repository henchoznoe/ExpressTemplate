/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/tests/auth.routes.test.ts
 * @title Auth Routes Integration Test
 * @description Integration tests for the /auth/register and /auth/login endpoints.
 * @last-modified 2025-11-14
 */

import { supabase } from '@config/supabase.js'
import supertest from 'supertest'
import app from '@/app.js'

// The supertest request agent
const request = supertest(app)

// --- Test Suite Setup ---

// Test user credentials
const testUser = {
    email: 'auth-user@test.com',
    name: 'Test User Auth',
    password: 'Pa$$w0rd',
}

const testUserInvalid = {
    email: 'not-an-email',
    password: 'weak',
}

// Clean up the test user from the database after all tests
afterAll(async () => {
    const { error } = await supabase.from('users').delete().eq('email', testUser.email)
    if (error) console.error('Error cleaning up auth test user:', error)
})

// --- Test Suite ---

describe('POST /auth/register - User Registration', () => {
    it('should return 400 for invalid email validation', async () => {
        const response = await request.post('/auth/register').send({
            email: testUserInvalid.email,
            name: testUser.name,
            password: testUser.password,
        })
        expect(response.status).toBe(400)
        expect(response.body.success).toBe(false)
        expect(response.body.message).toContain('Invalid email')
    })

    it('should return 400 for invalid password validation', async () => {
        const response = await request.post('/auth/register').send({
            email: testUser.email,
            name: testUser.name,
            password: testUserInvalid.password,
        })
        expect(response.status).toBe(400)
        expect(response.body.success).toBe(false)
        expect(response.body.message).toContain('Password must contain')
    })

    it('should return 201 on successful registration', async () => {
        const response = await request.post('/auth/register').send(testUser)
        expect(response.status).toBe(201)
        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe('Registration successful')
        expect(response.body.data.email).toBe(testUser.email)
        expect(response.body.data.token).toBeDefined()
    })

    it('should return 409 when registering with an email that already exists', async () => {
        const response = await request.post('/auth/register').send(testUser)
        expect(response.status).toBe(409)
        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe('Email address already in use.')
    })
})

describe('POST /auth/login - User Login', () => {
    it('should return 400 for invalid email validation', async () => {
        const response = await request.post('/auth/login').send({
            email: testUserInvalid.email,
            password: testUser.password,
        })
        expect(response.status).toBe(400)
        expect(response.body.success).toBe(false)
        expect(response.body.message).toContain('Invalid email')
    })

    it('should return 401 for wrong email', async () => {
        const response = await request.post('/auth/login').send({
            email: 'wrong@email.com',
            password: testUser.password,
        })
        expect(response.status).toBe(401)
        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe('Invalid email or password')
    })

    it('should return 401 for wrong password', async () => {
        const response = await request.post('/auth/login').send({
            email: testUser.email,
            password: 'WrongPassword123!',
        })
        expect(response.status).toBe(401)
        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe('Invalid email or password')
    })

    it('should return 200 on successful login', async () => {
        const response = await request.post('/auth/login').send({
            email: testUser.email,
            password: testUser.password,
        })
        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe('Login successful')
        expect(response.body.data.email).toBe(testUser.email)
        expect(response.body.data.token).toBeDefined()
    })
})
