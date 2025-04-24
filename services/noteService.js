const Note = require('../models/noteModels')

function getNotes() {
  return Note
    .find({})
}

function getNote({ id }) {
  return Note
    .findById(id)
}

function createNote({ data }) {
  const { content, important } = data
  const note = new Note({
    content,
    important
  })

  return note
    .save()
}

function updateNote({ id, data }) {
  return Note
    .findByIdAndUpdate(
      id,
      data,
      { new: true }
    )
}

function deleteNote({ id }) {
  return Note
    .findByIdAndDelete(id)
}

module.exports = { 
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote
}