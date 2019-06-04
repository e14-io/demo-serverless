const generateResponse = (code, payload) => ({
  statusCode: code,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  },
  body: JSON.stringify(payload)
})

const generateError = (code, err) =>
  generateResponse(code, { message: err.message })

module.exports = {
  generateResponse,
  generateError
}
