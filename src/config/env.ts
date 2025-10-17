import { log } from '@config/logger.js'
import { z } from 'zod'

const envSchema = z.object({
    CORS_ALLOWED_HEADERS: z.string().nonempty(),
    CORS_METHODS: z.string().nonempty(),
    CORS_ORIGIN: z.string().nonempty(),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z
        .string()
        .nonempty()
        .transform(val => parseInt(val, 10))
        .refine(val => !Number.isNaN(val) && val > 0, {
            message: 'PORT must be a positive integer',
        }),
    SUPABASE_ANON_KEY: z.string().nonempty(),
    SUPABASE_URL: z.url().nonempty(),
})

const parsedEnv = envSchema.safeParse(process.env)
if (!parsedEnv.success) {
    log.error('Invalid environment variables :')
    for (const issue of parsedEnv.error.issues) {
        const path = issue.path.join('.') || '(root)'
        const message = issue.message
        log.error(`- ${path} : ${message}`)
    }
    process.exit(1)
}

const config = {
    corsAllowedHeaders: parsedEnv.data.CORS_ALLOWED_HEADERS,
    corsMethods: parsedEnv.data.CORS_METHODS,
    corsOrigin: parsedEnv.data.CORS_ORIGIN,
    nodeEnv: parsedEnv.data.NODE_ENV,
    port: parsedEnv.data.PORT,
    supabaseAnonKey: parsedEnv.data.SUPABASE_ANON_KEY,
    supabaseUrl: parsedEnv.data.SUPABASE_URL,
}

export default config
