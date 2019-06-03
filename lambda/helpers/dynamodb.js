const AWS = require('aws-sdk')

const dynamodbOfflineOptions = {
  region: 'localhost',
  endpoint: `http://localhost:${process.env.DYNAMODB_LOCAL_PORT}`
}
const isOffline = () => process.env.IS_OFFLINE

module.exports.dynamoDb = isOffline()
  ? new AWS.DynamoDB.DocumentClient(dynamodbOfflineOptions)
  : new AWS.DynamoDB.DocumentClient()
