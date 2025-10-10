import type { Request, Response } from 'express';

import * as usersService from '../services/users.service.js';
import { sendError, sendSuccess } from '../utils/http-responses.js';

export const getAllUsers = async (_: Request, res: Response) => {
  try {
    const users = await usersService.getAllUsers();
    sendSuccess(res, 200, 'Users retrieved successfully', users);
  } catch ( err ) {
    sendError(
      res,
      500,
      err instanceof Error ? err.message : 'Internal Server Error'
    );
  }
};
