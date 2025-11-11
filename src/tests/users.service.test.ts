import * as usersRepository from '@db/users.repository.js'
import * as usersService from '@services/users.service.js'

vi.mock('@db/users.repository.js', () => ({
    getAllUsers: vi.fn(),
    getUserById: vi.fn(),
}))

describe('User Service', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    describe('getAllUsers', () => {
        it('should return all users from repository', async () => {
            const mockUsers = [
                { email: 'test1@mail.com', id: '1', name: 'Test User 1' },
                { email: 'test2@mail.com', id: '2', name: 'Test User 2' },
            ]

            vi.mocked(usersRepository.getAllUsers).mockResolvedValue(mockUsers)

            const result = await usersService.getAllUsers()

            expect(usersRepository.getAllUsers).toHaveBeenCalledTimes(1)

            expect(result).toEqual(mockUsers)
        })
    })
})
