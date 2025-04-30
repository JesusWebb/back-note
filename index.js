const  app = require('./app')

const { infoLogger } = require('./utils/logger')
const { PORT_SERVER } = require('./utils/constants')
const { ENV_PORT_SERVER } = require('./utils/config')

const PORT = ENV_PORT_SERVER || PORT_SERVER

app.listen(PORT, () => {
  infoLogger(`Server running on port ${PORT}`)
})
