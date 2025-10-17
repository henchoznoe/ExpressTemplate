import { setupLogger } from '@config/logger.js'
import type { Application } from 'express'

export const applyRequestLogger = (app: Application) => {
    setupLogger(app)
}
