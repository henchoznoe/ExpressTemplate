/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/services/users.service.ts
 * @title User Service Logic
 * @description Contains the business logic for user operations.
 * @last-modified 2025-11-17
 */

import { config } from '@config/env.js'
import type {
    CreateUserDto,
    IUserRepository,
    PaginationOptions,
    UpdateUserDto,
} from '@db/users.repository.interface.js'
import type { User } from '@models/user.model.js'
import bcrypt from 'bcrypt'
import { inject, injectable } from 'inversify'
import type {
    CreateUserSchemaType,
    UpdateUserSchemaType,
} from '@/schemas/auth.schema.js'
import { TYPES } from '@/types/ioc.types.js'

@injectable()
export class UserService {
    constructor(
        @inject(TYPES.UserRepository) private usersRepository: IUserRepository,
    ) {}

    async getAllUsers(options?: PaginationOptions): Promise<User[] | null> {
        return this.usersRepository.getAllUsers(options)
    }

    async getUserById(id: string): Promise<User | null> {
        return this.usersRepository.getUserById(id)
    }

    async createUser(userData: CreateUserSchemaType): Promise<User | null> {
        const hashedPassword = await bcrypt.hash(
            userData.password,
            config.bcryptSaltRounds,
        )
        const persistenceData: CreateUserDto = {
            ...userData,
            password: hashedPassword,
        }
        return this.usersRepository.createUser(persistenceData)
    }

    async updateUser(
        userId: string,
        userData: UpdateUserSchemaType,
    ): Promise<User | null> {
        const { password, ...rest } = userData
        let persistenceData: UpdateUserDto = rest
        if (password) {
            const hashedPassword = await bcrypt.hash(
                password,
                config.bcryptSaltRounds,
            )
            persistenceData = { ...rest, password: hashedPassword }
        }
        return this.usersRepository.updateUser(userId, persistenceData)
    }

    async deleteUser(id: string): Promise<User | null> {
        return this.usersRepository.deleteUser(id)
    }

    // Additional user-related methods can be added here
}
