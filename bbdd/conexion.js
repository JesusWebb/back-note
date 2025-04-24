const mongoose = require('mongoose')

const password = process.env.MONGO_PASSWORD
const url = `mongodb+srv://jesuscasesl:${password}@cluster0.ufduf9j.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Conexión con MongoDB')
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Error al conectar con MongoDB:', error.message)
  })

module.exports = mongoose
