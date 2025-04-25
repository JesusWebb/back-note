const mongoose = require('mongoose')

const {
  ENV_MONGODB_URI,
  ENV_MONGODB_USER,
  ENV_MONGODB_PASSWORD,
  ENV_MONGODB_CLUSTER,
  ENV_MONGODB_APP,
} = require('../util/config')

const uri = ENV_MONGODB_URI
  .replace('${MONGODB_USER}', ENV_MONGODB_USER)
  .replace('${MONGODB_PASSWORD}', ENV_MONGODB_PASSWORD)
  .replace('${MONGODB_CLUSTER}', ENV_MONGODB_CLUSTER)
  .replace('${MONGODB_APP}', ENV_MONGODB_APP)

mongoose.set('strictQuery', false)
mongoose.connect(uri)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Conexión con MongoDB')
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Error al conectar con MongoDB:', error.message)
  })

module.exports = mongoose
