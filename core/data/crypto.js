const crypto = require("crypto")

const algorithm = process.env.algorithm // algorithm to use
var secret = process.env.salt
const key = crypto.scryptSync(secret, 'salt', parseInt(process.env.salt_bits)) // create key

const iv = Buffer.alloc(16) // generate different ciphertext everytime

function data_encrypt(data_text) {

    const cipher = crypto.createCipheriv(algorithm, key, iv)
    return cipher.update(data_text, 'utf8', 'hex') + cipher.final('hex')
}

function data_decipher(encrypted) {

    try {
        const decipher = crypto.createDecipheriv(algorithm, key, iv)
        return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8'); // deciphered text
    } catch {
        return encrypted
    }
}

module.exports = {
    data_encrypt,
    data_decipher
}