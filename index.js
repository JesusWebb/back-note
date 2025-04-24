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
    '================================\n\n\n'
  ].join('\n')
})
// RUTA DESCONOCIDA
const unknownEndpoint = (request, response) => {
  response
    .status(404)
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
    .status(200)
    .send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  getNotes()
    .then((notes) => {
      if(!notes) {
        response
          .status(404)
          .json({ error: `Notes not found` })
      }

      response
        .status(200)
        .json(notes)
    })
    .catch((error) => {
      response
        .status(500)
        .json({ error: `Error interno del servidor: ${ error }` })
    })
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id

  getNote({ id })
    .then((note) => {
      if(!note) {
        response
          .status(404)
          .json({ error: `Id not found` })
      }

      response
        .status(200)
        .json(note)
    })
    .catch((error) => {
      if(error.name === 'CastError'){
        return response
          .status(404)
          .json({ error: `Id incorrecto:  ${ error }` }) 
      }
      response
        .status(500)
        .json({ error: `Error interno del servidor ${ error }` })
    })
})

app.post('/api/notes', (request, response) => {
  const body = request.body
  const { content } = body

  if (!body.content || !content) {
    return response
      .status(400)
      .json({ error: 'Body or content missing' })
  }

  // const maxId = notes.length > 0
  //   ? Math.max(...notes.map(n => n.id))
  //   : 0
  const data = {
    content: body.content || 'Default Text',
    important: Boolean(body.import) || false
  }
  createNote({ data })
    .then((dataRes) => {
      response
        .status(201)
        .json(dataRes)
    })
    .catch((error) => {
      response
        .status(500)
        .json({ error: `Error interno del servidor ${ error }` })
    })
})

app.put('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const { body } = request
  const { content, important } = body
  const note = { content, important}

  updateNote({ id, note })
    .then((data) => {
      response
        .status(201)
        .json(data)
    })
    .catch((error) => {
      response
        .status(500)
        .json({ error: `Error interno del servidor ${ error }` })
    })
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id

  deleteNote({ id })
    .then(() => {
      response
        .status(204)
        .end()
    })
    .catch((error) => {
      response
        .status(500)
        .json({ error: `Error interno del servidor ${ error }` })
    })
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})