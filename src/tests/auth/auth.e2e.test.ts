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
import type { IMailService } from '@services/mail/mail.service.interface.js'
import bcrypt from 'bcrypt'
import { StatusCodes } from 'http-status-codes'
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { app } from '@/app.js'
import { TYPES } from '@/types/ioc.types.js'

const usersRepository = container.get<IUserRepository>(TYPES.UserRepository)
const mailService = container.get<IMailService>(TYPES.MailService)

describe('Auth API (E2E)', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
        vi.spyOn(mailService, 'sendVerificationEmail').mockResolvedValue()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('POST /auth/register', () => {
        it('should return 201 and trigger email sending', async () => {
            const payload = {
                email: 'new@example.com',
                name: 'New User',
                password: 'Password123!',
            }

            vi.spyOn(usersRepository, 'createUser').mockResolvedValue({
                createdAt: new Date(),
                email: payload.email,
                id: '123',
                isVerified: false,
                name: payload.name,
                passwordResetExpires: null,
                passwordResetToken: null,
                updatedAt: new Date(),
                verificationToken: 'some-token',
            } as User)

            const response = await request(app)
                .post('/auth/register')
                .send(payload)

            expect(response.status).toBe(StatusCodes.CREATED)
            expect(response.body.accessToken).toBe('')
            expect(mailService.sendVerificationEmail).toHaveBeenCalled()
        })
    })

    describe('POST /auth/login', () => {
        it('should return 200 only if verified', async () => {
            const password = 'Password123!'
            const hashedPassword = await bcrypt.hash(password, 10)
            const user: UserWithPassword = {
                createdAt: new Date(),
                email: 'existing@example.com',
                id: '123',
                isVerified: true,
                name: 'User',
                password: hashedPassword,
                passwordResetExpires: null,
                passwordResetToken: null,
                updatedAt: new Date(),
                verificationToken: null,
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
