const jwt = require('jsonwebtoken')
const Users = require('../db/Users')
const { encrypt } = require('../helpers/crypto')
const { generateResponse, generateError } = require('../helpers/requests')
const { publishSnsTopic } = require('../helpers/sns')

module.exports.create = async event => {
  const params = JSON.parse(event.body)

  if (!params || !params.username) {
    return generateError(400, new Error('Provide username to create a user'))
  }
  if (!params || !params.email) {
    return generateError(400, new Error('Provide email to create a user'))
  }
  if (!params || !params.password) {
    return generateError(400, new Error('Provide password to create a user'))
  }

  try {
    const { username, email, password } = params

    // check user existance
    const user = await Users.get({ username })
    if (user.Item) {
      return generateError(409, new Error(`User ${username} already exists`))
    }

    // create new user
    await Users.put({
      username,
      email,
      password: encrypt(password)
    })

    // publish sns topic
    await publishSnsTopic({ username, email })
    return generateResponse(200, { message: 'Success' })
  } catch (err) {
    return generateError(500, new Error('Internal error'))
  }
}

module.exports.get = async event => {
  const { pathParameters } = event
  if (!pathParameters || !pathParameters.username) {
    return generateError(400, new Error('Provide username to get a user'))
  }

  try {
    const { username } = pathParameters

    // check user existance
    const user = await Users.get({ username })
    if (!user.Item) {
      return generateError(404, new Error(`User ${username} doesn't exists`))
    }

    const { email } = user.Item
    return generateResponse(200, {
      username,
      email
    })
  } catch (err) {
    return generateError(500, new Error('Internal error'))
  }
}

module.exports.all = async () => {
  try {
    const users = await Users.scan()
    const result = users.Items.map(user => {
      const { username, email } = user
      return { username, email }
    })
    return generateResponse(200, result)
  } catch (err) {
    return generateError(500, new Error('Internal error'))
  }
}

module.exports.update = async event => {
  const token = event.headers.Authorization.replace('Bearer ', '')
  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  const params = JSON.parse(event.body)
  if (!params || !params.username) {
    return generateError(400, new Error('Provide username to update a user'))
  }
  if (!params || !params.email) {
    return generateError(400, new Error('Provide email to update a user'))
  }
  if (params.username !== decoded.username) {
    return generateError(401, 'Unauthorized')
  }

  try {
    await Users.update(params)
    return generateResponse(200, { message: 'Success' })
  } catch (err) {
    return generateError(500, new Error('Internal error'))
  }
}
