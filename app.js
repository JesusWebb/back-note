
const express = require('express')
const cors = require('cors')
require('./bbdd/conexion')

const notesRouter = require('./controllers/noteController')
const usersRouter = require('./controllers/userController')
const loginRouter = require('./controllers/loginController')
const {
  initRequestMiddleware,
  requestLoggerMiddleware,
  morganInfoMiddleware,
  unknownEndpointMiddleware,
} = require('./utils/middleware')

const { STATUS } = require('./utils/constants')

const app = express()

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
    .status(STATUS.OK)
    .send('<h1>Hello World!</h1>')
})

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(unknownEndpointMiddleware)

module.exports = app
