const Users = require('../db/Users')
const { generateResponse, generateError } = require('../helpers/requests')

module.exports.create = async event => {
  const params = JSON.parse(event.body)

  if (!params || !params.username) {
    return generateError(400, new Error('Provide username to create a user'))
  }
  if (!params || !params.email) {
    return generateError(400, new Error('Provide email to create a user'))
  }

  try {
    const user = await Users.put(params)
    return generateResponse(200, {
      message: 'Success',
      data: { user: user.Item }
    })
  } catch (e) {
    console.log(e)
    return generateError(500, new Error('Internal error'))
  }
}

module.exports.get = async event => {
  const { pathParameters } = event

  if (!pathParameters || !pathParameters.username) {
    return generateError(400, new Error('Provide username to get a user'))
  }

  try {
    const user = await Users.get({ username: pathParameters.username })
    return generateResponse(200, user.Item)
  } catch (e) {
    console.log(e)
    return generateError(500, new Error('Internal error'))
  }
}

module.exports.all = async () => {
  try {
    const users = await Users.scan()
    return generateResponse(200, users)
  } catch (e) {
    console.log(e)
    return generateError(500, new Error('Internal error'))
  }
}

module.exports.update = async event => {
  const params = JSON.parse(event.body)

  if (!params || !params.username) {
    return generateError(400, new Error('Provide username to update a user'))
  }
  if (!params || !params.email) {
    return generateError(400, new Error('Provide email to update a user'))
  }

  try {
    const user = await Users.update(params)

    return generateResponse(200, {
      message: 'Success',
      data: { user: user.Attributes }
    })
  } catch (e) {
    console.log(e)
    return generateError(500, new Error('Internal error'))
  }
}

module.exports.delete = async event => {
  const { pathParameters } = event

  if (!pathParameters || !pathParameters.username) {
    return generateError(400, new Error('Provide username to delete a user'))
  }

  try {
    await Users.delete({ username: pathParameters.username })
    return generateResponse(200)
  } catch (e) {
    console.log(e)
    return generateError(500, new Error('Internal error'))
  }
}
