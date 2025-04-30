const noteRouter = require('express').Router()

const { STATUS } = require('../utils/constants')
const { getNotes, getNote, createNote, updateNote, deleteNote } = require('../services/noteService')

noteRouter.get('/', async (request, response) => {
  try {
    const notes = await getNotes()

    if (!notes || !notes.length) {
      return response
        .status(STATUS.NOT_FOUND)
        .json({ isError: true, msgError: 'Notes not found' })
    }

    return response
      .status(STATUS.OK)
      .json(notes)
  } catch (error) {
    return response
      .status(STATUS.INTERNAL_ERROR)
      .json({ isError: true, msgError: `Error interno del servidor: ${error}` })
  }
})

noteRouter.get('/:id', async (request, response) => {
  const id = request.params.id

  const note = await getNote({ id })
  try {
    if (!note) {
      return response
        .status(STATUS.NOT_FOUND)
        .json({ isError: true, msgError: 'Id not found' })
    }

    return response
      .status(STATUS.OK)
      .json(note)
  } catch (error) {
    if (error.name === 'CastError'){
      return response
        .status(STATUS.NOT_FOUND)
        .json({ isError: true, msgError: `Id incorrecto:  ${error}` })
    }
    return response
      .status(STATUS.INTERNAL_ERROR)
      .json({ isError: true, msgError: `Error interno del servidor ${error}` })
  }
})

noteRouter.post('/', async (request, response) => {
  const body = request.body
  const { content, important } = body

  if (!body.content || !content) {
    return response
      .status(STATUS.BAD_REQUEST)
      .json({ isError: true, msgError: 'Body or content missing' })
  }

  // const maxId = notes.length > 0
  //   ? Math.max(...notes.map(n => n.id))68126ff06884c478c363dd2c
  //   : 0
  const data = {
    content: content || 'Default Text',
    important: Boolean(important) || false,
  }
  try {
    const note = await createNote({ data })
    return response
      .status(STATUS.CREATED)
      .json(note)
  } catch (error) {
    if (error.name === 'ValidationError'){
      return response
        .status(STATUS.NOT_FOUND)
        .json({ isError: true, error: `Error en la valdiacion: ${error}` })
    }

    return response
      .status(STATUS.INTERNAL_ERROR)
      .json({ isError: true, msgError: `Error interno del servidor ${error}` })
  }
})

noteRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const { body } = request
  const { content, important } = body
  const noteUpdate = { content, important }
  if (!content) {
    return response
      .status(STATUS.BAD_REQUEST)
      .json({ isError: true, msgError: 'Body or content missing' })
  }

  const note = await updateNote({ id, note: noteUpdate })
  try {
    return response
      .status(STATUS.OK)
      .json(note)
  } catch (error) {
    return response
      .status(STATUS.INTERNAL_ERROR)
      .json({ isError: true, msgError: `Error interno del servidor ${error}` })
  }
})

noteRouter.delete('/:id', async (request, response) => {
  const id = request.params.id

  try {
    await deleteNote({ id })
      .then(() => {
        response
          .status(STATUS.NO_CONTENT)
          .end()
      })
  } catch (error)  {
    response
      .status(STATUS.INTERNAL_ERROR)
      .json({ isError: true, msgError: `Error interno del servidor ${error}` })
  }
})

module.exports = noteRouter
