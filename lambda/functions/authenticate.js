const jwt = require('jsonwebtoken')
const { generateResponse, generateError } = require('../helpers/requests')
const { encrypt } = require('../helpers/crypto')
const Users = require('../db/Users')

module.exports.authenticate = async event => {
  const params = JSON.parse(event.body)

  if (!params || !params.username) {
    return generateError(400, new Error('Provide username to authenticate'))
  }
  if (!params || !params.password) {
    return generateError(400, new Error('Provide password to authenticate'))
  }

  try {
    const { username, password } = params
    const user = await Users.get({ username })

    if (!user.Item || encrypt(password) !== user.Item.password) {
      return generateError(400, new Error('Wrong user or password'))
    }

    const token = jwt.sign(
      { username: user.Item.username },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION_TIME
      }
    )

    return generateResponse(200, { token })
  } catch (err) {
    return generateError(500, new Error('Internal error'))
  }
}
