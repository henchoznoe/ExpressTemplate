import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import zod, { z } from 'zod'

extendZodWithOpenApi(z)

export const CreateUserSchema = z
    .object({
        email: z.email('Invalid email address').openapi({ description: 'User email' }),
        name: z.string().min(2, 'Name must be at least 2 characters long').openapi({ description: 'Full name' }),
        password: z.string().min(6, 'Password must be at least 6 characters long').openapi({ description: 'Password' }),
    })
    .openapi('CreateUser')

export type CreateUserSchemaType = zod.infer<typeof CreateUserSchema>

export const UpdateUserSchema = zod
    .object({
        email: zod.email('Invalid email address').optional().openapi({ description: 'User email' }),
        id: zod.uuid('Invalid user ID').openapi({ description: 'User ID' }),
        name: zod
            .string()
            .min(2, 'Name must be at least 2 characters long')
            .optional()
            .openapi({ description: 'Full name' }),
        password: zod
            .string()
            .min(6, 'Password must be at least 6 characters long')
            .optional()
            .openapi({ description: 'Password' }),
    })
    .openapi('UpdateUser')

export type UpdateUserSchemaType = zod.infer<typeof UpdateUserSchema>
