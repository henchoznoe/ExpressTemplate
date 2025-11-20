/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/services/users.service.interface.ts
 * @title User Service Interface
 * @description Defines the contract for the user management service.
 * @last-modified 2025-11-18
 */

import type { PaginationOptions } from '@db/users.repository.interface.js'
import type { User } from '@models/user.model.js'
import type {
    CreateUserSchemaType,
    UpdateUserSchemaType,
} from '@schemas/auth.schema.js'

export interface IUserService {
    getAllUsers(options?: PaginationOptions): Promise<User[] | null>
    getUserById(id: string): Promise<User | null>
    createUser(userData: CreateUserSchemaType): Promise<User | null>
    updateUser(
        userId: string,
        userData: UpdateUserSchemaType,
    ): Promise<User | null>
    deleteUser(id: string): Promise<User | null>
}
