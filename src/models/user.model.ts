/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/models/user.model.ts
 * @title User Domain Models
 * @description Defines the core User data structures for the application.
 * @last-modified 2025-11-15
 */

// Represents the public-facing data for a User.
export interface User {
    id: string
    name: string
    email: string
    createdAt: Date
    updatedAt: Date
}

// Represents a User including internal data (e.g., hashed password).
export interface UserWithPassword extends User {
    password: string
}
