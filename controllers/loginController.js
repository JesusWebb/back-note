const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { STATUS } = require('../utils/constants')
const { ENV_SECRET } = require('../utils/config')

const { getUserName } = require('../services/userService')

const loginRouter = require('express').Router()

loginRouter.post('/', async (request, response) => {
  const minutes_60 = 60
  const { username, password } = request.body

  const user = await getUserName({ username })
  const passwordCorrect = (user === null)
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!user || !passwordCorrect) {
    return response
      .status(STATUS.NOT_AUTORIZED)
      .json({ isError: true,  msgError: 'invalid username or password' })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }
  const token = jwt.sign(userForToken, ENV_SECRET, { expiresIn: minutes_60 * minutes_60 })

  return response
    .status(STATUS.OK)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
