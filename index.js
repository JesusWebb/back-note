/* eslint-disable no-console */
require('dotenv').config()

const express = require('express')
const app = express()

require('./bbdd/conexion')
const morgan = require('morgan')
const cors = require('cors')

const { getNotes, getNote, createNote, updateNote, deleteNote } = require('./services/noteService')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

// - INIT - CONTANST
const STATUS_200 = 200
const STATUS_204 = 204
const STATUS_201 = 201
const STATUS_400 = 400
const STATUS_404 = 404
const STATUS_500 = 500
const SERVER_PORT = 3001

// - END - CONTANST

// - INIT - Middleware
// INICIO
const initRequest = (request, response, next) => {
  console.log('================================')
  console.log('==== INIT REQUEST')
  next()
}
// LOGGER
const requestLogger = (request, response, next) => {
  console.log('================================')
  console.log('==== INFO')
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  next()
}
// MORGAN
morgan.token('body', (req) => {
  return req.method === 'POST' || req.method === 'PUT'
    ? JSON.stringify(req.body)
    : ''
})
const morganInfo = morgan((tokens, req, res) => {
  return [
    '================================',
    '==== MORGAN',
    `${tokens.method(req, res)} ${tokens.url(req, res)} ${tokens.status(req, res)} ${tokens.res(req, res, 'content-length')} ${tokens['response-time'](req, res)} ms ${tokens.body(req, res)}`,
    '================================\n\n\n',
  ].join('\n')
})
// RUTA DESCONOCIDA
const unknownEndpoint = (request, response) => {
  response
    .status(STATUS_404)
    .send({ error: 'unknown endpoint' })
}
// - INIT - Middleware

app.use(initRequest)
app.use(morganInfo)
// Funciona bien, se usa el otro de MORGAN
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(requestLogger)

app.get('/', (request, response) => {
  response
    .status(STATUS_200)
    .send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  getNotes()
    .then((notes) => {
      if (!notes) {
        response
          .status(STATUS_404)
          .json({ isError: true, msgError: 'Notes not found' })
      }

      response
        .status(STATUS_200)
        .json(notes)
    })
    .catch((error) => {
      response
        .status(STATUS_500)
        .json({ isError: true, msgError: `Error interno del servidor: ${error}` })
    })
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id

  getNote({ id })
    .then((note) => {
      if (!note) {
        response
          .status(STATUS_404)
          .json({ msgError: 'Id not found' })
      }

      response
        .status(STATUS_200)
        .json(note)
    })
    .catch((error) => {
      if (error.name === 'CastError'){
        return response
          .status(STATUS_404)
          .json({ isError: true, msgError: `Id incorrecto:  ${error}` })
      }
      return response
        .status(STATUS_500)
        .json({ isError: true, msgError: `Error interno del servidor ${error}` })
    })
})

app.post('/api/notes', (request, response) => {
  const body = request.body
  const { content } = body

  if (!body.content || !content) {
    return response
      .status(STATUS_400)
      .json({ isError: true, msgError: 'Body or content missing' })
  }

  // const maxId = notes.length > 0
  //   ? Math.max(...notes.map(n => n.id))
  //   : 0
  const data = {
    content: body.content || 'Default Text',
    important: Boolean(body.import) || false,
  }
  return createNote({ data })
    .then((dataRes) => {
      return response
        .status(STATUS_201)
        .json(dataRes)
    })
    .catch((error) => {
      if (error.name === 'ValidationError'){
        return response
          .status(STATUS_404)
          .json({ error: `Error en la valdiacion:  ${error}` })
      }

      return response
        .status(STATUS_500)
        .json({ isError: true, msgError: `Error interno del servidor ${error}` })
    })
})

app.put('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const { body } = request
  const { content, important } = body
  const note = { content, important }
  if (!body.content) {
    return response
      .status(STATUS_400)
      .json({ isError: true, msgError: 'Body or content missing' })
  }

  return updateNote({ id, note })
    .then((data) => {
      return response
        .status(STATUS_201)
        .json(data)
    })
    .catch((error) => {
      response
        .status(STATUS_500)
        .json({ isError: true, msgError: `Error interno del servidor ${error}` })
    })
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id

  deleteNote({ id })
    .then(() => {
      response
        .status(STATUS_204)
        .end()
    })
    .catch((error) => {
      response
        .status(STATUS_500)
        .json({ isError: true, msgError: `Error interno del servidor ${error}` })
    })
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || SERVER_PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
