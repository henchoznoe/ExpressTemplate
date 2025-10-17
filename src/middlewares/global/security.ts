import config from '@config/env.js'
import { sendError } from '@utils/http-responses.js'
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS = 200
const SIZE_LIMIT = '2mb'

export const securityMiddlewares = [
    rateLimit({
        handler: (_, res) => sendError(res, 429, 'Too many requests, please try again later.'),
        limit: MAX_REQUESTS,
        windowMs: WINDOW_MS,
    }),
    helmet(),
    express.json({ limit: SIZE_LIMIT }),
    cors({
        allowedHeaders: config.corsAllowedHeaders,
        methods: config.corsMethods,
        origin: config.corsOrigin,
    }),
]
