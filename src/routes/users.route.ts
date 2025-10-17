import * as usersCtrl from '@controllers/users.controller.js'
import { validateFields } from '@middlewares/validations/validate-fields.js'
import { Router } from 'express'
import { CreateUserSchema, UpdateUserSchema } from '@/schemas/users.schema.js'

const usersRouter = Router()

usersRouter.get('/', usersCtrl.getAllUsers)
usersRouter.get('/:id', usersCtrl.getUserById)
usersRouter.post('/', validateFields(CreateUserSchema), usersCtrl.createUser)
usersRouter.put('/', validateFields(UpdateUserSchema), usersCtrl.updateUser)
usersRouter.delete('/:id', usersCtrl.deleteUser)

export default usersRouter
