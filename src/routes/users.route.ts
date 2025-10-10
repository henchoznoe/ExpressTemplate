import { Router } from 'express';

import * as usersCtrl from '../controllers/users.controller.js';

const usersRouter = Router();

usersRouter.get('/', usersCtrl.getAllUsers);

export default usersRouter;
