import config from '@config/env.js';
import { sendError } from '@utils/http-responses.js';
import cors from 'cors';
import type { Application } from 'express';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 200; // Max requests per window per IP
const SIZE_LIMIT = '2mb'; // Max request body size

export const setupMiddlewares = (app: Application) => {
	// Rate limiting middleware to limit the number of requests from a single IP
	app.use(
		rateLimit({
			windowMs: WINDOW_MS,
			limit: MAX_REQUESTS,
			handler: (_, res) =>
				sendError(res, 429, 'Too many requests, please try again later.'),
		}),
	);

	// Helmet middleware to secure Express apps by setting various HTTP headers
	app.use(helmet());

	// Body parser middleware to parse incoming request bodies
	app.use(express.json({ limit: SIZE_LIMIT }));
	app.use(express.urlencoded({ limit: SIZE_LIMIT, extended: true }));

	// Prevent the favicon.ico request from browsers
	app.get('/favicon.ico', (_, res) => {
		res.status(204).end();
	});

	// CORS middleware to allow cross-origin requests
	app.use(
		cors({
			origin: config.corsOrigin,
			methods: config.corsMethods,
			allowedHeaders: config.corsAllowedHeaders,
		}),
	);
};
