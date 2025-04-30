const { describe, test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const app = require('../app')

const api = supertest(app)
const Note = require('../models/noteModel')

const initialNotes = [
  { content: 'HTML is easy', important: false },
  { content: 'Browser can execute only JavaScript', important: true },
]

beforeEach(async () => {
  await Note.deleteMany({})
  // await Note.insertMany(initialNotes)

  const notePromises = []
  initialNotes.forEach(note => {
    const noteObject = new Note(note)
    notePromises.push(noteObject.save())
  })

  await Promise.all(notePromises)
})

describe('API NOTE', () => {
  test('HEADER - Content-Type json', async () => {
    const STATUS_200 = 200

    await api
      .get('/api/notes')
      .expect(STATUS_200)
      .expect('Content-Type', /application\/json/)
  })

  test('GET- Length Notes', async () => {
    const response = await api.get('/api/notes')

    assert.strictEqual(response.body.length, initialNotes.length)
  })

  test('GET - Include "HTML is easy" in one note', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(e => e.content)
    assert.strictEqual(contents.includes('HTML is easy'), true)
  })

  test('GET - One note', async () => {
    const STATUS_200 = 200

    const responseAll = await api.get('/api/notes')

    const response = await api
      .get(`/api/notes/${responseAll.body[0].id}`)
      .expect(STATUS_200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(response.body, responseAll.body[0])
  })

  test('POST - Added note', async () => {
    const STATUS_201 = 201
    const countNewNotes = 1
    const newNote = {
      content: 'New note test',
      important: true,
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(STATUS_201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/notes')
    const contents = response.body.map(r => r.content)
    assert.strictEqual(response.body.length, initialNotes.length + countNewNotes)
    assert(contents.includes('New note test'))
  })

  test('POST - Added note BAD REQUEST ', async () => {
    const STATUS_400 = 400
    const newNote = {
      important: true,
    }

    const responsePost = await api
      .post('/api/notes')
      .send(newNote)
      .expect(STATUS_400)

    const response = await api.get('/api/notes')
    assert.strictEqual(responsePost.res.statusCode, STATUS_400)
    assert.strictEqual(response.body.length, initialNotes.length)
  })

  test('DELETE - delete one note', async () => {
    const STATUS_204 = 204
    const responseAll = await api.get('/api/notes')

    await api
      .delete(`/api/notes/${responseAll.body[0].id}`)
      .expect(STATUS_204)

    const response = await api.get('/api/notes')
    assert.strictEqual(response.body.length, 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})
