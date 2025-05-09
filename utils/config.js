require('dotenv').config()

const ENV_SECRET = process.env.SECRET
const ENV_PORT_SERVER = process.env.PORT_SERVER
const ENV_MONGODB_USER = process.env.MONGODB_USER
const ENV_MONGODB_PASSWORD = process.env.MONGODB_PASSWORD
const ENV_MONGODB_CLUSTER = process.env.MONGODB_CLUSTER
const ENV_MONGODB_APP = process.env.MONGODB_APP
const MONGODB_URI = process.env.MONGODB_URI
const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI

const ENV_MONGODB_URI = process.env.NODE_ENV === 'test'

  ? TEST_MONGODB_URI
  : MONGODB_URI

module.exports = {
  ENV_SECRET,
  ENV_PORT_SERVER,
  ENV_MONGODB_URI,
  ENV_MONGODB_USER,
  ENV_MONGODB_PASSWORD,
  ENV_MONGODB_CLUSTER,
  ENV_MONGODB_APP,
}
