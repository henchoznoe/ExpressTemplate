/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/tests/users/users.service.spec.ts
 * @title User Service Tests
 * @description Unit tests for UserService.
 * @last-modified 2025-11-20
 */

import 'reflect-metadata'
import type { IUserRepository } from '@db/users.repository.interface.js'
import type { User } from '@models/user.model.js'
import { UserService } from '@services/users/users.service.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { type MockProxy, mock } from 'vitest-mock-extended'
import type { CreateUserSchemaType } from '@/schemas/auth.schema.js'

// --- Mocks ---
let usersRepositoryMock: MockProxy<IUserRepository>
let userService: UserService

describe('UserService', () => {
    beforeEach(() => {
        // Create a mock instance of the repository
        usersRepositoryMock = mock<IUserRepository>()
        // Inject the mock into the service
        userService = new UserService(usersRepositoryMock)
    })

    describe('getAllUsers', () => {
        it('should return a list of users', async () => {
            const mockUsers: User[] = [
                {
                    createdAt: new Date(),
                    email: 'john@example.com',
                    id: '123',
                    isVerified: false,
                    name: 'John Doe',
                    updatedAt: new Date(),
                },
            ]
            usersRepositoryMock.getAllUsers.mockResolvedValue(mockUsers)

            const result = await userService.getAllUsers()

            expect(result).toEqual(mockUsers)
            expect(usersRepositoryMock.getAllUsers).toHaveBeenCalledTimes(1)
        })
    })

    describe('createUser', () => {
        it('should hash password and create user', async () => {
            // Arrange
            const input: CreateUserSchemaType = {
                email: 'jane@example.com',
                name: 'Jane Doe',
                password: 'Password123!',
            }

            const createdUser: User = {
                createdAt: new Date(),
                email: input.email,
                id: '456',
                isVerified: false,
                name: input.name,
                updatedAt: new Date(),
            }

            usersRepositoryMock.createUser.mockResolvedValue(createdUser)

            const result = await userService.createUser(input)

            expect(result).toEqual(createdUser)
            expect(usersRepositoryMock.createUser).toHaveBeenCalledWith(
                expect.objectContaining({
                    password: expect.not.stringMatching(input.password),
                }),
            )
        })
    })
})
