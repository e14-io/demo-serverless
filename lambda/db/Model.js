const uuid = require('uuid')
const { dynamoDb } = require('../helpers/dynamodb')

class Model {
  static async put(data) {
    const timestamp = new Date().getTime()
    const params = {
      TableName: this.TABLE,
      Item: {
        id: uuid.v1(),
        createdAt: timestamp,
        updatedAt: timestamp,
        ...this.getPutParams(data)
      }
    }
    await dynamoDb.put(params).promise()
    return params
  }

  static async update(data) {
    const params = {
      TableName: this.TABLE,
      ...this.getUpdateParams(data)
    }
    const result = await dynamoDb.update(params).promise()
    return result
  }

  static async scan(props) {
    const params = {
      TableName: this.TABLE,
      ...props
    }
    const result = await dynamoDb.scan(params).promise()
    return result
  }

  static async get(key) {
    const params = {
      TableName: this.TABLE,
      Key: key
    }
    const result = await dynamoDb.get(params).promise()
    return result
  }

  static async delete(key) {
    const params = {
      TableName: this.TABLE,
      Key: key
    }
    const result = await dynamoDb.delete(params).promise()
    return result
  }

  static getPutParams(props) {
    return props
  }
}

module.exports = Model
