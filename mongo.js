const mongoose = require('mongoose')

const POSITION_FOR_SLICE_PASS = 3
if (process.argv.length < POSITION_FOR_SLICE_PASS) {
  process.exit(1)
}

const password = 'mongofull88'
const url = `mongodb+srv://jesuscasesl:${password}@cluster0.ufduf9j.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// console.log("Create")
// const note = new Note({
//   content: "HTML is easy",
//   important: true
// })

// note.save()
//   .then(result => {
//     console.log('note saved!')
//     mongoose.connection.close()
// })

Note
  .find({ important: true })
  .then(result => {
    result.forEach(note => {
      // eslint-disable-next-line no-console
      console.log(note)
    })
    mongoose.connection.close()
  })
