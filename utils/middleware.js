const morgan = require('morgan')
const { infoLogger } = require('./logger')
const { STATUS } = require('./constants')

// INICIO
function initRequestMiddleware (request, response, next) {
  infoLogger('================================')
  infoLogger('==== INIT REQUEST')
  next()
}

// LOGGER
function requestLoggerMiddleware (request, response, next) {
  const { method, path, body } = request
  infoLogger('================================')
  infoLogger('==== INFO')
  infoLogger('Method:', method)
  infoLogger('Path:  ', path)
  infoLogger('Body:  ', body)
  next()
}

// MORGAN
function morganInfoMiddleware (req, res, next) {
  morgan.token('body', (req) => {
    return req.method === 'POST' || req.method === 'PUT'
      ? JSON.stringify(req.body)
      : ''
  })

  const morganMiddleware = morgan((tokens, req, res) => {
    return [
      '==== MORGAN',
      `${tokens.method(req, res)} ${tokens.url(req, res)} ${tokens.status(req, res)} ${tokens.res(req, res, 'content-length')} - ${tokens['response-time'](req, res)} ms ${tokens.body(req, res)}`,
      '================================',
    ].join('\n')
  })

  morganMiddleware (req, res, (err) => {
    if (err) {
      return next(err)
    }
    return next()
  })
}

// RUTA DESCONOCIDA
function unknownEndpointMiddleware (request, response) {
  response
    .status(STATUS.NOT_FOUND)
    .send({ error: 'unknown endpoint' })
}

// ERROR
function errorHandler (error, request, response, next) {
  infoLogger.error(error.message)

  if (error.name === 'CastError') {
    return response
      .status(STATUS.BAD_REQUEST)
      .send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response
      .status(STATUS.BAD_REQUEST)
      .json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response
      .status(STATUS.BAD_REQUEST)
      .json({ error: 'expected "username" to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response
      .status(STATUS.NOT_AUTORIZED)
      .json({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return response
      .status(STATUS.NOT_AUTORIZED)
      .json({ error: 'token expired' })
  }

  next(error)
  return error
}

module.exports = {
  initRequestMiddleware,
  requestLoggerMiddleware,
  morganInfoMiddleware,
  unknownEndpointMiddleware,
  errorHandler,
}
