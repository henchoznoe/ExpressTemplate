import * as usersCtrl from '@controllers/users.controller.js';
import { Router } from 'express';

const usersRouter = Router();

usersRouter.get('/', usersCtrl.getAllUsers);

export default usersRouter;
