const User = require('../models/userModel')

function getUsers () {
  return User.find({})
}
function getUsersAll () {
  // return User.find({}).populate('notes')
  return User.find({}).populate('notes', { content: 1, important: 1 })
}

function getUser ({ id }) {
  return User.findById(id)
}

function getUserName ({ username }) {
  return User.findOne({ username })
}

function createUser ({ data }) {
  const userNew = new User(data)

  return userNew.save()
}

function saveUser ({ user }) {
  return user.save()
}

module.exports = {
  getUsers,
  getUsersAll,
  getUser,
  getUserName,
  createUser,
  saveUser,
}
