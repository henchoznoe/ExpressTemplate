const dotenv = require('dotenv')
const path = require('node:path')

dotenv.config({ path: path.resolve(process.cwd(), '.env.production') })

module.exports = {
    apps: [
        {
            env: { ...process.env },
            name: 'express-template',
            script: 'dist/index.js',
        },
    ],
}
