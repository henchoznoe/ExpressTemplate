/**
 * @file src/db/prisma-users.repository.ts
 * @title Prisma User Repository
 * @description Prisma-specific implementation of the IUserRepository using Dependency Injection.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

import { PrismaErrorCode } from '@db/prisma-errors.enum.js'
import {
    MSG_EMAIL_IN_USE,
    MSG_RESOURCE_NOT_FOUND,
} from '@db/repo-messages.constants.js'
import type {
    CreateUserDto,
    IUserRepository,
    PaginationOptions,
    UpdateUserDto,
} from '@db/users.repository.interface.js'
import type {
    RefreshToken,
    User,
    UserWithPassword,
} from '@models/user.model.js'
import { Prisma, type PrismaClient } from '@prisma/client'
import { AppError } from '@typings/errors/AppError.js'
import { StatusCodes } from 'http-status-codes'
import { inject, injectable } from 'inversify'
import { TYPES } from '@/types/ioc.types.js'

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

@injectable()
export class PrismaUsersRepository implements IUserRepository {
    // Inject the PrismaClient via constructor instead of importing the global instance.
    constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

    private getNotFoundMessage(id?: string): string {
        return id
            ? `${MSG_RESOURCE_NOT_FOUND} (ID: ${id})`
            : MSG_RESOURCE_NOT_FOUND
    }

    async getAllUsers(options?: PaginationOptions): Promise<User[]> {
        const { skip = 0, take = 10 } = options || {}
        return this.prisma.user.findMany({
            select: userSelect,
            skip,
            take,
        })
    }

    async getUserById(id: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            select: userSelect,
            where: { id },
        })
        if (!user)
            throw new AppError(
                this.getNotFoundMessage(id),
                StatusCodes.NOT_FOUND,
            )
        return user
    }

    async findUserByEmail(email: string): Promise<UserWithPassword | null> {
        return this.prisma.user.findUnique({ where: { email } })
    }

    async createUser(userData: CreateUserDto): Promise<User> {
        try {
            return await this.prisma.user.create({
                data: userData,
                select: userSelect,
            })
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION) {
                    throw new AppError(MSG_EMAIL_IN_USE, StatusCodes.CONFLICT)
                }
            }
            throw e
        }
    }

    async updateUser(userId: string, userData: UpdateUserDto): Promise<User> {
        try {
            return await this.prisma.user.update({
                data: userData,
                select: userSelect,
                where: { id: userId },
            })
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === PrismaErrorCode.RECORD_NOT_FOUND) {
                    throw new AppError(
                        this.getNotFoundMessage(userId),
                        StatusCodes.NOT_FOUND,
                    )
                }
                if (e.code === PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION) {
                    throw new AppError(MSG_EMAIL_IN_USE, StatusCodes.CONFLICT)
                }
            }
            throw e
        }
    }

    async deleteUser(id: string): Promise<User | null> {
        try {
            return await this.prisma.user.delete({
                select: userSelect,
                where: { id },
            })
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === PrismaErrorCode.RECORD_NOT_FOUND) {
                    return null
                }
            }
            throw e
        }
    }

    async createRefreshToken(
        id: string,
        userId: string,
        tokenHash: string,
        expiresAt: Date,
    ): Promise<RefreshToken> {
        return this.prisma.refreshToken.create({
            data: {
                expiresAt,
                id,
                tokenHash,
                userId,
            },
        })
    }

    async findRefreshTokenById(id: string): Promise<RefreshToken | null> {
        return this.prisma.refreshToken.findUnique({
            where: { id },
        })
    }

    async deleteRefreshToken(id: string): Promise<RefreshToken> {
        try {
            return await this.prisma.refreshToken.delete({
                where: { id },
            })
        } catch (e) {
            if (
                e instanceof Prisma.PrismaClientKnownRequestError &&
                e.code === PrismaErrorCode.RECORD_NOT_FOUND
            ) {
                throw new AppError(
                    MSG_RESOURCE_NOT_FOUND,
                    StatusCodes.NOT_FOUND,
                )
            }
            throw e
        }
    }

    async deleteAllRefreshTokensForUser(userId: string): Promise<void> {
        await this.prisma.refreshToken.deleteMany({
            where: { userId },
        })
    }

    // Additional repository methods can be added here as needed.
}
