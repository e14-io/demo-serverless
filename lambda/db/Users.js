const Model = require('./Model')

class Users extends Model {
  static get TABLE() {
    return process.env.USERS_TABLE
  }

  static getUpdateParams(data) {
    const timestamp = new Date().getTime()
    return {
      Key: { username: data.username },
      ExpressionAttributeNames: {
        '#email': 'email'
      },
      ExpressionAttributeValues: {
        ':email': data.email,
        ':updatedAt': timestamp
      },
      UpdateExpression: 'SET #email = :email, updatedAt = :updatedAt',
      ReturnValues: 'ALL_NEW'
    }
  }
}

module.exports = Users
