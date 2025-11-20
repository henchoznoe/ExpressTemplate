/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/tests/auth/auth.e2e.test.ts
 * @title Auth API End-to-End Tests
 * @description End-to-End integration tests for Auth routes using mocked repository.
 * @last-modified 2025-11-20
 */

import 'reflect-metadata'
import { container } from '@config/container.js'
import type { IUserRepository } from '@db/users.repository.interface.js'
import type { UserWithPassword } from '@models/user.model.js'
import type { RefreshToken, User } from '@prisma/client'
import bcrypt from 'bcrypt'
import { StatusCodes } from 'http-status-codes'
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { app } from '@/app.js'
import { TYPES } from '@/types/ioc.types.js'

const usersRepository = container.get<IUserRepository>(TYPES.UserRepository)

describe('Auth API (E2E)', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('POST /auth/register', () => {
        it('should return 201 on successful registration', async () => {
            const payload = {
                email: 'new@example.com',
                name: 'New User',
                password: 'Password123!',
            }

            vi.spyOn(usersRepository, 'createUser').mockResolvedValue({
                createdAt: new Date(),
                email: payload.email,
                id: '123',
                name: payload.name,
                updatedAt: new Date(),
            } as User)

            vi.spyOn(usersRepository, 'createRefreshToken').mockResolvedValue(
                {} as RefreshToken,
            )

            const response = await request(app)
                .post('/auth/register')
                .send(payload)

            expect(response.status).toBe(StatusCodes.CREATED)
            expect(response.body).toHaveProperty('accessToken')
            expect(response.body.user).toHaveProperty('email', payload.email)
        })

        it('should return 400 for invalid input', async () => {
            const response = await request(app).post('/auth/register').send({
                email: 'not-an-email',
                password: 'short',
            })
            expect(response.status).toBe(StatusCodes.BAD_REQUEST)
        })
    })

    describe('POST /auth/login', () => {
        it('should return 200 and tokens on success', async () => {
            const password = 'Password123!'
            const hashedPassword = await bcrypt.hash(password, 10)
            const user: UserWithPassword = {
                createdAt: new Date(),
                email: 'existing@example.com',
                id: '123',
                name: 'User',
                password: hashedPassword,
                updatedAt: new Date(),
            }

            vi.spyOn(usersRepository, 'findUserByEmail').mockResolvedValue(user)
            vi.spyOn(usersRepository, 'createRefreshToken').mockResolvedValue(
                {} as RefreshToken,
            )

            const response = await request(app).post('/auth/login').send({
                email: user.email,
                password: password,
            })

            expect(response.status).toBe(StatusCodes.OK)
            expect(response.body).toHaveProperty('accessToken')
        })
    })
})
