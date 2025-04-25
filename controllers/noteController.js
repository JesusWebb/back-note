const noteRouter = require('express').Router()
const { getNotes, getNote, createNote, updateNote, deleteNote } = require('../services/noteService')

const  {
  STATUS_200,
  STATUS_204,
  STATUS_201,
  STATUS_400,
  STATUS_404,
  STATUS_500,
} = require('../util/constans')

noteRouter.get('/', (request, response) => {
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

noteRouter.get('/:id', (request, response) => {
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

noteRouter.post('/', (request, response) => {
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

noteRouter.put('/:id', (request, response) => {
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

noteRouter.delete('/:id', (request, response) => {
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

module.exports = noteRouter
