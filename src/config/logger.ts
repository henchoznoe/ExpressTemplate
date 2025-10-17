import type { Application, NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import statuses from 'statuses'
import { createLogger, format, transports } from 'winston'
import 'winston-daily-rotate-file'
import type { AppError } from '@my-types/errors/AppError.js'
import { sendError } from '@utils/http-responses.js'

const { combine, timestamp, printf, colorize, errors, splat } = format

const logLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'info'

const consoleFormat = combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    splat(),
    printf(({ level, message, timestamp, stack }) =>
        stack ? `${timestamp} [${level}] ${message}\n${stack}` : `${timestamp} [${level}] ${message}`,
    ),
)

const consoleTransport = new transports.Console({ format: consoleFormat })

const dailyRotateTransport = new transports.DailyRotateFile({
    datePattern: 'YYYY-MM-DD',
    filename: 'logs/%DATE%-app.log',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(({ timestamp, level, message }) => `${timestamp} [${level}] ${message}`),
    ),
    level: 'info',
    maxFiles: '14d',
    maxSize: '20m',
    zippedArchive: true,
})

const errorRotateTransport = new transports.DailyRotateFile({
    datePattern: 'YYYY-MM-DD',
    filename: 'logs/%DATE%-error.log',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(({ timestamp, level, message, stack }) =>
            stack ? `${timestamp} [${level}] ${message}\n${stack}` : `${timestamp} [${level}] ${message}`,
        ),
    ),
    level: 'error',
    maxFiles: '30d',
    maxSize: '20m',
    zippedArchive: true,
})

export const log = createLogger({
    exitOnError: false,
    format: combine(errors({ stack: true }), splat(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })),
    level: logLevel,
    transports: [consoleTransport, dailyRotateTransport, errorRotateTransport],
})

export const setupLogger = (app: Application) => {
    morgan.token('statusName', (_: Request, res: Response) => {
        const code = res.statusCode
        const name = statuses.message[code] || 'Unknown Status'
        return `${code} - ${name}`
    })

    morgan.token('clientIp', (req: Request) => req.ip)

    app.use(
        morgan(':method :url [:statusName] [:clientIp]', {
            stream: {
                write: (message: string) => {
                    const statusCode = parseInt(message.split('[')[1].split(' - ')[0], 10)
                    if (statusCode >= 500) log.error(message.trim())
                    else if (statusCode >= 400) log.warn(message.trim())
                    else log.info(message.trim())
                },
            },
        }),
    )
}

export const errorLoggerMiddleware = (err: unknown, _req: Request, res: Response, _: NextFunction) => {
    if (err instanceof Error) {
        const appErr = err as AppError
        sendError(res, appErr.status || 500, appErr.message)
    }
}
