const { describe, test, after } = require('node:test')
const assert = require('node:assert')
const request = require('supertest')
const mongoose = require('mongoose')

const app = require('../app')

describe('Index.js file', () => {
  test('GET /hello - 200', async () => {
    const STATUS_200 = 200
    const response = await request(app).get('/hello')

    assert.strictEqual(response.status, STATUS_200)
    assert.ok(response.text.includes('Hello World!'))
  })

  test('Unknown endpoints - 404', async () => {
    const STATUS_404 = 404
    const response = await request(app).get('/unknown-endpoint')
    assert.strictEqual(response.status, STATUS_404)
  })
})

after(async () => {
  await mongoose.connection.close()
})
