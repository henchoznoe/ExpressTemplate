import config from '@config/env.js'
import { log } from '@config/logger.js'
import app from '@/app.js'

app.listen(config.port, () => {
    log.info(`⚠️ App running in ${config.nodeEnv} mode`)
    log.info(`🚀 Express server ready at: http://localhost:${config.port}`)
    log.info(`💻 API docs ready at: http://localhost:${config.port}/api-docs`)
}).on('error', (error: Error & { code?: string }) => {
    log.error(`❌ Server failed to start: ${error.message}`)
    process.exit(1)
})
