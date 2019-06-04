const AWS = require('aws-sdk')

const sns = new AWS.SNS()

const publishSnsTopic = async (data, topic = 'new-user') => {
  const params = {
    Message: JSON.stringify(data),
    TopicArn: `${process.env.ARN}:${topic}`
  }
  return sns.publish(params).promise()
}

module.exports = {
  publishSnsTopic
}
