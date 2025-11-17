/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/services/users.service.ts
 * @title User Service Logic
 * @description Contains the business logic for user operations.
 * @last-modified 2025-11-16
 */

// --- Imports ---
import { config } from '@config/env.js'
import type {
    CreateUserPersistence,
    IUserRepository,
    UpdateUserPersistence,
} from '@db/users.repository.interface.js'
import type { User } from '@models/user.model.js'
import bcrypt from 'bcrypt'
import type {
    CreateUserSchemaType,
    UpdateUserSchemaType,
} from '@/schemas/auth.schema.js'

export class UserService {
    constructor(private usersRepository: IUserRepository) {}

    async getAllUsers(): Promise<User[] | null> {
        return this.usersRepository.getAllUsers()
    }

    async getUserById(id: string): Promise<User | null> {
        return this.usersRepository.getUserById(id)
    }

    async createUser(userData: CreateUserSchemaType): Promise<User | null> {
        const hashedPassword = await bcrypt.hash(
            userData.password,
            config.bcryptSaltRounds,
        )
        const persistenceData: CreateUserPersistence = {
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
        let persistenceData: UpdateUserPersistence = rest
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
