const bcrypt = require('bcrypt')

const { STATUS } = require('../utils/constants')
const { getUsers, getUsersAll, getUser, createUser } = require('../services/userService')

const userRouter = require('express').Router()

userRouter.get('/', async (request, response) => {
  const users = await getUsers()

  return response
    .status(STATUS.OK)
    .json(users)
})

userRouter.get('/all', async (request, response) => {
  const users = await getUsersAll()

  return response
    .status(STATUS.OK)
    .json(users)
})

userRouter.get('/:id', async (request, response) => {
  const id = request.params.id

  try {
    const user = await getUser({ id })

    if (!user) {
      return response
        .status(STATUS.NOT_FOUND)
        .json({ isError: true, msgError: 'Id not found' })
    }

    return response
      .status(STATUS.OK)
      .json(user)
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

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username || !name || !password) {
    return response
      .status(STATUS.BAD_REQUEST)
      .json({ isError: true, msgError: 'Body or content missing' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const data = {
    username,
    name,
    passwordHash,
  }

  try {
    const user = await createUser({ data })
    return response
      .status(STATUS.CREATED)
      .json(user)
  } catch (error) {
    if (error.name === 'ValidationError'){
      return response
        .status(STATUS.NOT_FOUND)
        .json({ isError: true, error: `Error en la valdiacion: ${error}` })
    }

    if (error.name === 'MongoServerError'){
      return response
        .status(STATUS.NOT_FOUND)
        .json({ isError: true, error: `Duplicate username: ${error}` })
    }

    return response
      .status(STATUS.INTERNAL_ERROR)
      .json({ isError: true, msgError: `Error interno del servidor ${error}` })
  }
})

module.exports = userRouter
