const { generateResponse } = require('../helpers/requests')

module.exports.handler = async event => {
  console.log(event)

  return generateResponse(200, { message: 'Success' })
}
