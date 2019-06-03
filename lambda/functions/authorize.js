const jwt = require('jsonwebtoken')
const { buildIAMPolicy } = require('../helpers/policy')
const Users = require('../db/Users')

module.exports.authorize = async (event, context, callback) => {
  console.log('AUTHORIZE FUNCTION - EVENT: ', event)
  console.log('AUTHORIZE FUNCTION - CONTEXT: ', context)
  console.log('AUTHORIZE FUNCTION - CALLBACK: ', callback)

  const authToken =
    event.authorizationToken ||
    (event.queryStringParameters && event.queryStringParameters.Auth)
  if (!authToken) {
    return callback('Unauthorized')
  }
  const token = authToken.replace('Bearer ', '')

  try {
    // Verify jwt token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await Users.get({ username: decoded.username })

    if (!user.Item) {
      return callback('Unauthorized')
    }

    // TODO: Checks if the user's scopes allow to call the current function
    const isAllowed = true

    const effect = isAllowed ? 'Allow' : 'Deny'
    const userId = user.username
    const authorizerContext = { user: JSON.stringify(user) }
    // Return an IAM policy document for the current endpoint
    const policyDocument = buildIAMPolicy(
      userId,
      effect,
      event.methodArn,
      authorizerContext
    )
    return callback(null, policyDocument)
  } catch (err) {
    return callback('Unauthorized')
  }
}
