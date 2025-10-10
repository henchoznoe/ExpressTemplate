import * as usersRepository from '../db/users.repository.js';

export const getAllUsers = async () => {
    return await usersRepository.getAllUsers();
};
