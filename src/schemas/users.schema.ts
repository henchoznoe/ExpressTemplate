import zod from 'zod'

export const CreateUserSchema = zod.object({
    email: zod.email('Invalid email address'),
    name: zod.string().min(2, 'Name must be at least 2 characters long'),
    password: zod.string().min(6, 'Password must be at least 6 characters long'),
})

export type CreateUserSchemaType = zod.infer<typeof CreateUserSchema>

export const UpdateUserSchema = zod.object({
    email: zod.email('Invalid email address').optional(),
    id: zod.uuid('Invalid user ID'),
    name: zod.string().min(2, 'Name must be at least 2 characters long').optional(),
    password: zod.string().min(6, 'Password must be at least 6 characters long').optional(),
})

export type UpdateUserSchemaType = zod.infer<typeof UpdateUserSchema>
