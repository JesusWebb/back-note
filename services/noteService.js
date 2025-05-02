const Note = require('../models/noteModel')

function getNotes () {
  return Note
    .find({})
}

function getNotesAll () {
  return Note
    .find({})
    .populate('user', { username: 1 })
}

function getNote ({ id }) {
  return Note
    .findById(id)
}

function createNote ({ data }) {
  const note = new Note(data)

  return note
    .save()
}

function updateNote ({ id, data }) {
  return Note
    .findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true, context: 'query' },
    )
}

function deleteNote ({ id }) {
  return Note
    .findByIdAndDelete(id)
}

module.exports = {
  getNotes,
  getNotesAll,
  getNote,
  createNote,
  updateNote,
  deleteNote,
}
