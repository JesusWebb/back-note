const jwt = require('jsonwebtoken')

const { ENV_SECRET } = require('../utils/config')

function getTokenFrom (request) {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

function decodedTokenFun ({ request }) {
  const decodedToken = jwt.verify(getTokenFrom(request), ENV_SECRET)
  return decodedToken
}

module.exports = decodedTokenFun
