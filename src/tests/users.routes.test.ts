/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/tests/users.routes.test.ts
 * @title User Routes Integration Test
 * @description Integration tests for all protected /users routes.
 * @last-modified 2025-11-14
 */

import { supabase } from '@config/supabase.js'
import supertest from 'supertest'
import { v4 as uuidv4 } from 'uuid'
import app from '@/app.js'

// The supertest request agent
const request = supertest(app)

// --- Test Suite Setup ---

let authToken = ''
let mainUserId = ''

const mainUser = {
    email: 'user-routes@test.com',
    name: 'Test User Routes',
    password: 'Password123!',
}

const secondaryUser = {
    email: 'user-routes-2@test.com',
    name: 'Test User 2',
    password: 'Password123!',
}
let secondaryUserId = ''

beforeAll(async () => {
    await request.post('/auth/register').send(mainUser)

    const response = await request.post('/auth/login').send({
        email: mainUser.email,
        password: mainUser.password,
    })

    authToken = response.body.data.token
    mainUserId = response.body.data.id
})

afterAll(async () => {
    const { error } = await supabase.from('users').delete().in('email', [mainUser.email, secondaryUser.email])
    if (error) console.error('Error cleaning up users test users:', error)
})

// --- Test Suite ---

describe('Security - /users routes', () => {
    it('should return 401 when accessing GET /users without a token', async () => {
        const response = await request.get('/users')
        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Access denied. No token provided.')
    })

    it('should return 401 when accessing GET /users with an invalid token', async () => {
        const response = await request.get('/users').set('Authorization', 'Bearer 12345')
        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Invalid token.')
    })
})

describe('POST /users - Create User (Protected)', () => {
    it('should return 201 when creating a new user with a valid token', async () => {
        const response = await request.post('/users').set('Authorization', `Bearer ${authToken}`).send(secondaryUser)

        expect(response.status).toBe(201)
        expect(response.body.success).toBe(true)
        expect(response.body.data.email).toBe(secondaryUser.email)
        expect(response.body.data.password).toBeUndefined()
        secondaryUserId = response.body.data.id
    })

    it('should return 400 for validation error (invalid email)', async () => {
        const response = await request
            .post('/users')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ ...secondaryUser, email: 'bad-email' })

        expect(response.status).toBe(400)
    })
})

describe('GET /users - Read Users (Protected)', () => {
    it('should return 200 and a list of users', async () => {
        const response = await request.get('/users').set('Authorization', `Bearer ${authToken}`)

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(Array.isArray(response.body.data)).toBe(true)
        expect(response.body.data.length).toBeGreaterThanOrEqual(2)
    })

    it('should return 200 and the main user details for GET /users/:id', async () => {
        const response = await request.get(`/users/${mainUserId}`).set('Authorization', `Bearer ${authToken}`)

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.data.id).toBe(mainUserId)
        expect(response.body.data.email).toBe(mainUser.email)
    })

    it('should return 404 for a user ID that does not exist', async () => {
        const fakeId = uuidv4()
        const response = await request.get(`/users/${fakeId}`).set('Authorization', `Bearer ${authToken}`)

        expect(response.status).toBe(404)
        expect(response.body.success).toBe(false)
    })
})

describe('PATCH /users/:id - Update User (Protected)', () => {
    it('should return 200 and update the user name', async () => {
        const newName = 'Updated Test Name'
        const response = await request
            .patch(`/users/${mainUserId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ name: newName })

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.data.name).toBe(newName)
        expect(response.body.data.email).toBe(mainUser.email)
    })

    it('should return 404 when trying to update a non-existent user', async () => {
        const fakeId = uuidv4()
        const response = await request
            .patch(`/users/${fakeId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ name: 'Fake Name' })

        expect(response.status).toBe(404)
    })
})

describe('DELETE /users/:id - Delete User (Protected)', () => {
    it('should return 200 and delete the secondary user', async () => {
        const response = await request.delete(`/users/${secondaryUserId}`).set('Authorization', `Bearer ${authToken}`)

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.data.id).toBe(secondaryUserId)
    })

    it('should return 404 when trying to delete a user that no longer exists', async () => {
        const response = await request.delete(`/users/${secondaryUserId}`).set('Authorization', `Bearer ${authToken}`)

        expect(response.status).toBe(404)
    })
})
