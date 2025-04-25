const morgan = require('morgan')
const { infoLogger } = require('./logger')
const { STATUS_404 } = require('./config')

// INICIO
function initRequestMiddleware (request, response, next) {
  infoLogger('================================')
  infoLogger('==== INIT REQUEST')
  next()
}

// LOGGER
function requestLoggerMiddleware (request, response, next) {
  infoLogger('================================')
  infoLogger('==== INFO')
  infoLogger('Method:', request.method)
  infoLogger('Path:  ', request.path)
  infoLogger('Body:  ', request.body)
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
    next()
  })
}

// RUTA DESCONOCIDA
function unknownEndpointMiddleware (request, response) {
  response
    .status(STATUS_404)
    .send({ error: 'unknown endpoint' })
}

module.exports = {
  initRequestMiddleware,
  requestLoggerMiddleware,
  morganInfoMiddleware,
  unknownEndpointMiddleware,
}
