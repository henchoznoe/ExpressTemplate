/**
 * @file src/routes/paths.ts
 * @title Application Route Paths
 * @description This file defines and exports all route path constants used in the application.
 * @author Noé Henchoz
 * @date 2025-12-02
 * @license MIT
 * @copyright (c) 2025 Noé Henchoz
 */

// --- Route Path Constants ---
export const ROUTE_HEALTH = '/'
export const ROUTE_AUTH = '/auth'
export const ROUTE_USERS = '/users'
// Additional route paths can be added here

// --- Sub-Path Constants ---
export const PATH_ROOT = '/'
export const PATH_ID = '/:id'
export const PATH_REGISTER = '/register'
export const PATH_LOGIN = '/login'
export const PATH_REFRESH = '/refresh'
export const PATH_VERIFY_EMAIL = '/verify-email'
export const PATH_FORGOT_PASSWORD = '/forgot-password'
export const PATH_RESET_PASSWORD = '/reset-password'

// --- Route Tag Constants ---
export const TAG_AUTH = ['Authentication']
export const TAG_USERS = ['Users']
export const TAG_HEALTH = ['Health Check']
// Additional tags can be added here
