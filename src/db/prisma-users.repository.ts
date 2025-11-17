/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/db/prisma-users.repository.ts
 * @title Prisma User Repository
 * @description Prisma-specific implementation of the IUserRepository.
 * @last-modified 2025-11-17
 */

import { prisma } from '@config/prisma.js'
import { PrismaErrorCode } from '@db/prisma-errors.enum.js'
import {
    MSG_EMAIL_IN_USE,
    MSG_RESOURCE_NOT_FOUND,
} from '@db/repo-messages.constants.js'
import type {
    CreateUserPersistence,
    IUserRepository,
    PaginationOptions,
    UpdateUserPersistence,
} from '@db/users.repository.interface.js'
import type { User, UserWithPassword } from '@models/user.model.js'
import { Prisma } from '@prisma/client'
import { AppError } from '@typings/errors/AppError.js'

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
    private getNotFoundMessage(id?: string): string {
        return id
            ? `${MSG_RESOURCE_NOT_FOUND} (ID: ${id})`
            : MSG_RESOURCE_NOT_FOUND
    }

    async getAllUsers(options?: PaginationOptions): Promise<User[]> {
        const { skip = 0, take = 10 } = options || {}
        return prisma.user.findMany({
            select: userSelect,
            skip,
            take,
        })
    }

    async getUserById(id: string): Promise<User> {
        const user = await prisma.user.findUnique({
            select: userSelect,
            where: { id },
        })
        if (!user) throw new AppError(this.getNotFoundMessage(id), 404)
        return user
    }

    async findUserByEmail(email: string): Promise<UserWithPassword | null> {
        return prisma.user.findUnique({ where: { email } })
    }

    async createUser(userData: CreateUserPersistence): Promise<User> {
        try {
            return await prisma.user.create({
                data: userData,
                select: userSelect,
            })
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION) {
                    throw new AppError(MSG_EMAIL_IN_USE, 409)
                }
            }
            throw e
        }
    }

    async updateUser(
        userId: string,
        userData: UpdateUserPersistence,
    ): Promise<User> {
        try {
            return await prisma.user.update({
                data: userData,
                select: userSelect,
                where: { id: userId },
            })
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === PrismaErrorCode.RECORD_NOT_FOUND) {
                    throw new AppError(this.getNotFoundMessage(userId), 404)
                }
                if (e.code === PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION) {
                    throw new AppError(MSG_EMAIL_IN_USE, 409)
                }
            }
            throw e
        }
    }

    async deleteUser(id: string): Promise<User> {
        try {
            return await prisma.user.delete({
                select: userSelect,
                where: { id },
            })
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === PrismaErrorCode.RECORD_NOT_FOUND) {
                    throw new AppError(this.getNotFoundMessage(id), 404)
                }
            }
            throw e
        }
    }

    // Additional repository methods can be added here as needed.
}
