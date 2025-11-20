/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/tests/auth/auth.service.spec.ts
 * @title Auth Service Tests
 * @description Unit tests for AuthService.
 * @last-modified 2025-11-20
 */

import 'reflect-metadata'
import type { IUserRepository } from '@db/users.repository.interface.js'
import type { RefreshToken, UserWithPassword } from '@models/user.model.js'
import { AuthService } from '@services/auth/auth.service.js'
import { AppError } from '@typings/errors/AppError.js'
import bcrypt from 'bcrypt'
import { StatusCodes } from 'http-status-codes'
import { beforeEach, describe, expect, it } from 'vitest'
import { type MockProxy, mock } from 'vitest-mock-extended'

// --- Mocks ---
let usersRepositoryMock: MockProxy<IUserRepository>
let authService: AuthService

describe('AuthService', () => {
    beforeEach(() => {
        // Create a mock instance of the repository
        usersRepositoryMock = mock<IUserRepository>()
        // Inject the mock into the service
        authService = new AuthService(usersRepositoryMock)
    })

    describe('register', () => {
        it('should hash password and return tokens', async () => {
            const credentials = {
                email: 'test@example.com',
                name: 'Test User',
                password: 'password123',
            }
            const createdUser: UserWithPassword = {
                id: 'uid',
                ...credentials,
                createdAt: new Date(),
                password: 'hashed',
                updatedAt: new Date(),
            }

            usersRepositoryMock.createUser.mockResolvedValue(createdUser)
            usersRepositoryMock.createRefreshToken.mockResolvedValue(
                {} as RefreshToken,
            )

            const result = await authService.register(credentials)

            expect(result).toHaveProperty('accessToken')
            expect(result.user).toEqual(createdUser)
            // Check that password was hashed
            expect(usersRepositoryMock.createUser).toHaveBeenCalledWith(
                expect.objectContaining({
                    password: expect.not.stringMatching('password123'),
                }),
            )
        })
    })

    describe('login', () => {
        it('should throw 401 if password invalid', async () => {
            const user: UserWithPassword = {
                createdAt: new Date(),
                email: 'test@test.com',
                id: 'uid',
                name: 'User',
                password: await bcrypt.hash('real_password', 10),
                updatedAt: new Date(),
            }

            usersRepositoryMock.findUserByEmail.mockResolvedValue(user)

            await expect(
                authService.login({ email: user.email, password: 'wrong' }),
            ).rejects.toThrow(
                new AppError(
                    'Invalid email or password',
                    StatusCodes.UNAUTHORIZED,
                ),
            )
        })
    })
})
