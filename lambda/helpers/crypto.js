const crypto = require('crypto')

const encrypt = text => {
  const key = crypto.createCipher('aes-128-cbc', process.env.CRYPTO_SECRET_KEY)
  let encryptedText = key.update(text, 'utf8', 'hex')
  encryptedText += key.final('hex')
  return encryptedText
}

const decrypt = text => {
  const key = crypto.createDecipher(
    'aes-128-cbc',
    process.env.CRYPTO_SECRET_KEY
  )
  let decryptedText = key.update(text, 'hex', 'utf8')
  decryptedText += key.final('utf8')
  return decryptedText
}

module.exports = {
  encrypt,
  decrypt
}
