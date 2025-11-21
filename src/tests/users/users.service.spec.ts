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
import type {
    CreateUserSchemaType,
    UpdateUserSchemaType,
} from '@/schemas/auth.schema.js'

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

    describe('updateUser', () => {
        const mockUser: User = {
            createdAt: new Date(),
            email: 'original@example.com',
            id: '789',
            isVerified: true,
            name: 'Test User',
            updatedAt: new Date(),
        }

        it('should reset isVerified to false when email is changed', async () => {
            // Arrange
            const updateData: UpdateUserSchemaType = {
                email: 'newemail@example.com',
                name: 'Test User',
            }

            usersRepositoryMock.getUserById.mockResolvedValue(mockUser)
            usersRepositoryMock.updateUser.mockResolvedValue({
                ...mockUser,
                email: updateData.email ?? mockUser.email,
                isVerified: false,
            })

            // Act
            await userService.updateUser(mockUser.id, updateData)

            // Assert
            expect(usersRepositoryMock.getUserById).toHaveBeenCalledWith(
                mockUser.id,
            )
            expect(usersRepositoryMock.updateUser).toHaveBeenCalledWith(
                mockUser.id,
                expect.objectContaining({
                    email: updateData.email,
                    isVerified: false,
                }),
            )
        })

        it('should not change isVerified when email is not changed', async () => {
            // Arrange
            const updateData: UpdateUserSchemaType = {
                email: 'original@example.com', // Same email
                name: 'Updated Name',
            }

            usersRepositoryMock.getUserById.mockResolvedValue(mockUser)
            usersRepositoryMock.updateUser.mockResolvedValue({
                ...mockUser,
                name: updateData.name ?? mockUser.name,
            })

            // Act
            await userService.updateUser(mockUser.id, updateData)

            // Assert
            expect(usersRepositoryMock.getUserById).toHaveBeenCalledWith(
                mockUser.id,
            )
            expect(usersRepositoryMock.updateUser).toHaveBeenCalledWith(
                mockUser.id,
                expect.objectContaining({
                    email: updateData.email,
                    name: updateData.name,
                }),
            )
            // isVerified should not be set in the update data
            expect(usersRepositoryMock.updateUser).toHaveBeenCalledWith(
                mockUser.id,
                expect.not.objectContaining({
                    isVerified: expect.anything(),
                }),
            )
        })

        it('should not check isVerified when email is not provided in update', async () => {
            // Arrange
            const updateData: UpdateUserSchemaType = {
                name: 'Updated Name Only',
            }

            usersRepositoryMock.updateUser.mockResolvedValue({
                ...mockUser,
                name: updateData.name ?? mockUser.name,
            })

            // Act
            await userService.updateUser(mockUser.id, updateData)

            // Assert
            expect(usersRepositoryMock.getUserById).not.toHaveBeenCalled()
            expect(usersRepositoryMock.updateUser).toHaveBeenCalledWith(
                mockUser.id,
                expect.objectContaining({
                    name: updateData.name,
                }),
            )
        })

        it('should hash password when password is provided', async () => {
            // Arrange
            const updateData: UpdateUserSchemaType = {
                password: 'NewPassword123!',
            }

            usersRepositoryMock.updateUser.mockResolvedValue(mockUser)

            // Act
            await userService.updateUser(mockUser.id, updateData)

            // Assert
            expect(usersRepositoryMock.updateUser).toHaveBeenCalledWith(
                mockUser.id,
                expect.objectContaining({
                    password: expect.not.stringMatching(
                        updateData.password ?? '',
                    ),
                }),
            )
        })

        it('should reset isVerified and hash password when both email and password are changed', async () => {
            // Arrange
            const updateData: UpdateUserSchemaType = {
                email: 'newemail@example.com',
                password: 'NewPassword123!',
            }

            usersRepositoryMock.getUserById.mockResolvedValue(mockUser)
            usersRepositoryMock.updateUser.mockResolvedValue({
                ...mockUser,
                email: updateData.email ?? mockUser.email,
                isVerified: false,
            })

            // Act
            await userService.updateUser(mockUser.id, updateData)

            // Assert
            expect(usersRepositoryMock.getUserById).toHaveBeenCalledWith(
                mockUser.id,
            )
            expect(usersRepositoryMock.updateUser).toHaveBeenCalledWith(
                mockUser.id,
                expect.objectContaining({
                    email: updateData.email,
                    isVerified: false,
                    password: expect.not.stringMatching(
                        updateData.password ?? '',
                    ),
                }),
            )
        })
    })
})
