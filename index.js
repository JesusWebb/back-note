const  app = require('./app')

const  { infoLogger } = require('./util/logger')
const  { PORT_SERVER } = require('./util/constans')
const { ENV_PORT_SERVER } = require('./util/config')

const PORT = ENV_PORT_SERVER || PORT_SERVER

app.listen(PORT, () => {
  infoLogger(`Server running on port ${PORT}`)
})
