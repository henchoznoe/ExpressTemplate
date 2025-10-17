import { z } from 'zod';
import { log } from './logger.js';

const envSchema = z.object({
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),
	PORT: z
		.string()
		.nonempty()
		.transform((val) => parseInt(val, 10))
		.refine((val) => !Number.isNaN(val) && val > 0, {
			message: 'PORT must be a positive integer',
		}),
	CORS_ORIGIN: z.string().nonempty(),
	CORS_METHODS: z.string().nonempty(),
	CORS_ALLOWED_HEADERS: z.string().nonempty(),
	SUPABASE_URL: z.url().nonempty(),
	SUPABASE_ANON_KEY: z.string().nonempty(),
});

const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
	log.error('Invalid environment variables :');
	for (const issue of parsedEnv.error.issues) {
		const path = issue.path.join('.') || '(root)';
		const message = issue.message;
		log.error(`- ${path} : ${message}`);
	}
	process.exit(1);
}

const config = {
	nodeEnv: parsedEnv.data.NODE_ENV,
	port: parsedEnv.data.PORT,
	corsOrigin: parsedEnv.data.CORS_ORIGIN,
	corsMethods: parsedEnv.data.CORS_METHODS,
	corsAllowedHeaders: parsedEnv.data.CORS_ALLOWED_HEADERS,
	supabaseUrl: parsedEnv.data.SUPABASE_URL,
	supabaseAnonKey: parsedEnv.data.SUPABASE_ANON_KEY,
};

export default config;
