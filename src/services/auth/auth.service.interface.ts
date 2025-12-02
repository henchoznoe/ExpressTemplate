/**
 * @file src/services/auth/auth.service.interface.ts
 * @title Auth Service Interface
 * @description Defines the contract for the authentication service.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

import type { User } from '@models/user.model.js'
import type {
    LoginSchemaType,
    RegisterSchemaType,
} from '@schemas/auth.schema.js'

export type AuthResponse = {
    accessToken: string
    refreshToken: string
    user?: User
}

export type RefreshResponse = {
    accessToken: string
    refreshToken: string
}

export interface IAuthService {
    register(credentials: RegisterSchemaType): Promise<AuthResponse>
    login(credentials: LoginSchemaType): Promise<AuthResponse>
    refreshAuth(incomingRefreshToken: string): Promise<RefreshResponse>
}
