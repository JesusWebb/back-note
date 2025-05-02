const { describe, test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const app = require('../app')

const User = require('../models/userModel')

const api = supertest(app)

beforeEach(async () => {
  const PROP_HASH = 10
  await User.deleteMany({})
  // await User.insertMany(initialUser)

  const passwordHash = await bcrypt.hash('sekret', PROP_HASH)
  const user = new User({ username: 'root', passwordHash })
  await user.save()
})

describe('API User', () => {
  test('HEADER - Content-Type json', async () => {
    const STATUS_200 = 200

    await api
      .get('/api/users')
      .expect(STATUS_200)
      .expect('Content-Type', /application\/json/)
  })

  test('GET- Length Users', async () => {
    const result_expec = 1
    const response = await api.get('/api/users')

    assert.strictEqual(response.body.length, result_expec)
  })

  test('POST - Added user', async () => {
    const STATUS_201 = 201
    const result_expec = 2
    const resultName_expec = 'mluukkai'

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(STATUS_201)
      .expect('Content-Type', /application\/json/)

    const responseAllUsers = await api.get('/api/users')
    assert.strictEqual(responseAllUsers.body.length, result_expec)

    const usernames = responseAllUsers.body.map(u => u.username)
    assert(usernames.includes(resultName_expec))
  })

  test('POST - Added user UNIQUE', async () => {
    const STATUS_404 = 404

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(STATUS_404)
      .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('duplicate key'))
  })
})

after(async () => {
  await mongoose.connection.close()
})
