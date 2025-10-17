import type { Application, Request, Response } from 'express'
import morgan from 'morgan'
import statuses from 'statuses'
import { createLogger, format, transports } from 'winston'

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
                    log[statusCode < 400 ? 'info' : 'error'](message.trim())
                },
            },
        }),
    )
}

const { combine, timestamp, printf, colorize } = format

const customFormat = printf(({ level, message, timestamp }) => `${timestamp} [${level}] ${message}`)

export const log = createLogger({
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), colorize(), customFormat),
    level: 'info',
    transports: [new transports.Console()],
})
