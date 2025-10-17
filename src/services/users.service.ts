import * as usersRepository from '@db/users.repository.js'

export const getAllUsers = async () => await usersRepository.getAllUsers()
