/**
 * @copyright Copyright (c) 2025 Noé Henchoz
 * @author Noé Henchoz
 * @file src/tests/users.service.test.ts
 * @title User Service Unit Test
 * @description Unit tests for the user service logic, mocking the database repository.
 * @last-modified 2025-11-11
 */

// --- Imports ---
import * as usersRepository from '@db/users.repository.js'
import * as usersService from '@services/users.service.js'

// --- Constants ---
const MOCK_USERS_LIST = [
    { email: 'test1@mail.com', id: '1', name: 'Test User 1' },
    { email: 'test2@mail.com', id: '2', name: 'Test User 2' },
]

// --- Mocking ---

// Mock the entire users repository.
// This isolates the service layer from the database for true unit testing.
vi.mock('@db/users.repository.js', () => ({
    createUser: vi.fn(),
    deleteUser: vi.fn(),
    getAllUsers: vi.fn(),
    getUserById: vi.fn(),
    updateUser: vi.fn(),
}))

// --- Test Suite ---

describe('User Service', () => {
    /**
     * Before each test, restore all mocks to their original state.
     * This prevents mocks from one test from "leaking" into another.
     */
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    describe('getAllUsers', () => {
        /**
         * Test case: Verifies that the service correctly calls the repository
         * and returns the data it receives.
         */
        it('should return all users from repository', async () => {
            // --- Arrange ---
            // Tell the mocked repository function what to return when called
            vi.mocked(usersRepository.getAllUsers).mockResolvedValue(MOCK_USERS_LIST)

            // --- Act ---
            // Call the service function we are testing
            const result = await usersService.getAllUsers()

            // --- Assert ---
            // 1. Check that the repository was called exactly once
            expect(usersRepository.getAllUsers).toHaveBeenCalledTimes(1)
            // 2. Check that the service returned the data from the repository
            expect(result).toEqual(MOCK_USERS_LIST)
        })
    })

    // (Future tests for getUserById, createUser, etc., would go here)
})
