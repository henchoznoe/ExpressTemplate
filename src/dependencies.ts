/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/dependencies.ts
 * @title Dependency Injector
 * @description Instantiates and wires up all application dependencies (repositories, services).
 * @last-modified 2025-11-14
 */

// --- 1. Import Concrete Implementations ---
import { SupabaseUsersRepository } from '@db/supabase-users.repository.js'
import { AuthService } from '@services/auth.service.js'
import { UserService } from '@services/users.service.js'

// --- 2. Instantiate Repositories ---
export const usersRepository = new SupabaseUsersRepository()

// --- 3. Instantiate Services (Injecting Repos) ---
export const userService = new UserService(usersRepository)
export const authService = new AuthService(usersRepository, userService)
