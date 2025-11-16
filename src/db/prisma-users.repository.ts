/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/db/prisma-users.repository.ts
 * @title Prisma User Repository
 * @description Prisma-specific implementation of the IUserRepository.
 * @last-modified 2025-11-15
 */

// --- Imports ---
import { prisma } from '@config/prisma.js'
import type { CreateUserPersistence, IUserRepository, UpdateUserPersistence } from '@db/users.repository.interface.js'
import type { User, UserWithPassword } from '@models/user.model.js'
import { Prisma } from '@prisma/client'
import { AppError } from '@typings/errors/AppError.js'

// --- Constants ---

// Error Messages
const MSG_RESOURCE_NOT_FOUND_PREFIX = 'Resource'
const MSG_RESOURCE_NOT_FOUND_SUFFIX = 'not found.'

/**
 * Defines the fields to select for a "public" user, excluding the password.
 * This ensures we never accidentally return a hashed password.
 */
const userSelect = {
    createdAt: true,
    email: true,
    id: true,
    name: true,
    updatedAt: true,
}

export class PrismaUsersRepository implements IUserRepository {
    private createNotFoundMessage(contextId?: string): string {
        const idInfo = contextId ? ` with ID ${contextId}` : ''
        return `${MSG_RESOURCE_NOT_FOUND_PREFIX}${idInfo} ${MSG_RESOURCE_NOT_FOUND_SUFFIX}`
    }

    async getAllUsers(): Promise<User[] | null> {
        return prisma.user.findMany({
            select: userSelect,
        })
    }

    async getUserById(id: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            select: userSelect,
            where: { id },
        })
        // findUnique returns null if not found, it doesn't throw.
        if (!user) {
            throw new AppError(this.createNotFoundMessage(id), 404)
        }
        return user
    }

    async findUserByEmail(email: string): Promise<UserWithPassword | null> {
        // This is the ONLY method that should return the password.
        return prisma.user.findUnique({
            where: { email },
        })
    }

    async createUser(userData: CreateUserPersistence): Promise<User | null> {
        try {
            return await prisma.user.create({
                data: userData,
                select: userSelect,
            })
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new AppError('Email address already in use.', 409)
                }
            }
            throw e // Re-throw unexpected errors
        }
    }

    async updateUser(userId: string, userData: UpdateUserPersistence): Promise<User | null> {
        try {
            return await prisma.user.update({
                data: userData,
                select: userSelect,
                where: { id: userId },
            })
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    throw new AppError(this.createNotFoundMessage(userId), 404)
                }
                if (e.code === 'P2002') {
                    throw new AppError('Email address already in use.', 409)
                }
            }
            throw e
        }
    }

    async deleteUser(id: string): Promise<User | null> {
        try {
            return await prisma.user.delete({
                select: userSelect,
                where: { id },
            })
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    // Record to delete not found
                    throw new AppError(this.createNotFoundMessage(id), 404)
                }
            }
            throw e
        }
    }

    // Additional repository methods can be added here as needed.
}
