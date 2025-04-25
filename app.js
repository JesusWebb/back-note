
const express = require('express')
const cors = require('cors')
require('./bbdd/conexion')

const app = express()

const notesRouter = require('./controllers/noteController')
const { STATUS_200 } = require('./util/constans')
const {
  initRequestMiddleware,
  requestLoggerMiddleware,
  morganInfoMiddleware,
  unknownEndpointMiddleware } = require('./util/middleware')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.use(initRequestMiddleware)
app.use(requestLoggerMiddleware)
app.use(morganInfoMiddleware)
// Funciona bien, se usa el otro de MORGAN
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/hello', (request, response) => {
  response
    .status(STATUS_200)
    .send('<h1>Hello World!</h1>')
})

app.use('/api/notes', notesRouter)

app.use(unknownEndpointMiddleware)

module.exports = app
