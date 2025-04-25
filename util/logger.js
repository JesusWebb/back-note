/* eslint-disable no-console */
function infoLogger (...informacion){
  console.log(...informacion)
}

function errorLogger (...error){
  console.error(...error)
}

module.exports = {
  infoLogger,
  errorLogger,
}
