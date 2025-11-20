/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/tests/auth/auth.service.spec.ts
 * @title Auth Service Tests
 * @description Unit tests for AuthService with email verification support.
 * @last-modified 2025-11-20
 */

import 'reflect-metadata'
import type { IUserRepository } from '@db/users.repository.interface.js'
import type { RefreshToken, UserWithPassword } from '@models/user.model.js'
import { AuthService } from '@services/auth/auth.service.js'
import type { IMailService } from '@services/mail/mail.service.interface.js'
import { AppError } from '@typings/errors/AppError.js'
import bcrypt from 'bcrypt'
import { StatusCodes } from 'http-status-codes'
import { beforeEach, describe, expect, it } from 'vitest'
import { type MockProxy, mock } from 'vitest-mock-extended'

// --- Mocks ---
let usersRepositoryMock: MockProxy<IUserRepository>
let mailServiceMock: MockProxy<IMailService>
let authService: AuthService

describe('AuthService', () => {
    beforeEach(() => {
        usersRepositoryMock = mock<IUserRepository>()
        mailServiceMock = mock<IMailService>()
        authService = new AuthService(usersRepositoryMock, mailServiceMock)
    })

    describe('register', () => {
        it('should hash password, send email, and NOT return tokens', async () => {
            const credentials = {
                email: 'test@example.com',
                name: 'Test User',
                password: 'password123',
            }
            const createdUser: UserWithPassword = {
                id: 'uid',
                ...credentials,
                createdAt: new Date(),
                isVerified: false,
                password: 'hashed',
                passwordResetExpires: null,
                passwordResetToken: null,
                updatedAt: new Date(),
                verificationToken: 'verif-token',
            }

            usersRepositoryMock.createUser.mockResolvedValue(createdUser)

            usersRepositoryMock.createRefreshToken.mockResolvedValue(
                {} as RefreshToken,
            )

            const result = await authService.register(credentials)

            expect(mailServiceMock.sendVerificationEmail).toHaveBeenCalledWith(
                credentials.email,
                expect.any(String),
            )

            expect(result.accessToken).toBe('')
            expect(result.user).toEqual(createdUser)
        })
    })

    describe('login', () => {
        it('should throw 403 if email is not verified', async () => {
            const password = 'password123'
            const hashedPassword = await bcrypt.hash(password, 10)

            const user: UserWithPassword = {
                createdAt: new Date(),
                email: 'test@test.com',
                id: 'uid',
                isVerified: false,
                name: 'User',
                password: hashedPassword,
                passwordResetExpires: null,
                passwordResetToken: null,
                updatedAt: new Date(),
                verificationToken: 'token',
            }

            usersRepositoryMock.findUserByEmail.mockResolvedValue(user)

            await expect(
                authService.login({ email: user.email, password }),
            ).rejects.toThrow(
                new AppError(
                    'Please verify your email address before logging in.',
                    StatusCodes.FORBIDDEN,
                ),
            )
        })

        it('should return tokens if verified', async () => {
            const password = 'password123'
            const hashedPassword = await bcrypt.hash(password, 10)

            const user: UserWithPassword = {
                createdAt: new Date(),
                email: 'test@test.com',
                id: 'uid',
                isVerified: true,
                name: 'User',
                password: hashedPassword,
                passwordResetExpires: null,
                passwordResetToken: null,
                updatedAt: new Date(),
                verificationToken: null,
            }

            usersRepositoryMock.findUserByEmail.mockResolvedValue(user)
            usersRepositoryMock.createRefreshToken.mockResolvedValue(
                {} as RefreshToken,
            )

            const result = await authService.login({
                email: user.email,
                password,
            })

            expect(result).toHaveProperty('accessToken')
            expect(result.accessToken).not.toBe('')
        })
    })
})
