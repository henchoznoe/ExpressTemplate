import supertest from 'supertest'
import app from '@/app.js'
import pkg from '../../package.json' with { type: 'json' }

const request = supertest(app)

describe('GET / - Health Check', () => {
    it('should return 200 OK with application info', async () => {
        const response = await request.get('/')
        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe('Health check successful')
        expect(response.body.data.version).toBe(pkg.version)
        expect(response.body.data.node).toBe(process.version)
    })
})
