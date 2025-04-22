const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

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
// FINAL
const endRequest = (request, response, next) => {
  response.on('finish', () => {
    console.log('================================')
    console.log('==== FIN REQUEST')
    console.log('================================')
    console.log()
  })
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
  response
    .status(200)
    .json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find((note) => Number(note.id) === Number(id))

  if(!note) {
    response
      .status(404)
      .end()
      // .send("Nota no encontrada")
  }

  response
    .status(200)
    .json(note)
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response
      .status(400)
      .json({ error: 'content missing' })
  }

  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0

  const newNote = {
    id: maxId + 1,
    content: body.content || '',
    import: Boolean(body.import) || false
  }

  notes = [...notes, newNote]

  response
    .status(201)
    .json(newNote)
})

app.put('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const { body } = request

  console.log(body);
  
  const newNoteList = notes
    .map((note) => {
      return Number(note.id) === Number(id)
        ? body
        : note
      })
  notes = newNoteList

  response
    .status(201)
    .json(body)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter((note) => Number(note.id) !== Number(id))

  response
    .status(204)
    .end()
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})