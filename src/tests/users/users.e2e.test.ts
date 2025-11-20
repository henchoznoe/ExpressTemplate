/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/tests/users/users.e2e.test.ts
 * @title Users API End-to-End Tests
 * @description End-to-End integration tests for User routes using mocked repository.
 * @last-modified 2025-11-20
 */

import 'reflect-metadata'
import { container } from '@config/container.js'
import { config } from '@config/env.js'
import type { IUserRepository } from '@db/users.repository.interface.js'
import type { User } from '@models/user.model.js'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { app } from '@/app.js'
import { TYPES } from '@/types/ioc.types.js'

const usersRepository = container.get<IUserRepository>(TYPES.UserRepository)

const generateTestToken = (id: string) => {
    return jwt.sign({ id }, config.jwtAccessSecret, { expiresIn: '15m' })
}

describe('Users API (E2E)', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('GET /users', () => {
        it('should return 401 if no token is provided', async () => {
            const response = await request(app).get('/users')
            expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
        })

        it('should return 200 and list users if token is valid', async () => {
            const mockUsers: User[] = [
                {
                    createdAt: new Date(),
                    email: 'test@test.com',
                    id: '123',
                    name: 'Test User',
                    updatedAt: new Date(),
                },
            ]

            vi.spyOn(usersRepository, 'getAllUsers').mockResolvedValue(
                mockUsers,
            )

            const token = generateTestToken('123')
            const response = await request(app)
                .get('/users')
                .set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(StatusCodes.OK)
            expect(response.body).toHaveLength(1)
            expect(response.body[0].email).toBe('test@test.com')
        })
    })

    describe('GET /health', () => {
        it('should return 200 OK', async () => {
            const response = await request(app).get('/')
            expect(response.status).toBe(StatusCodes.OK)
            expect(response.body.environment).toBe('test')
        })
    })
})
