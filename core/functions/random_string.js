/**
 * Gera uma string aleatória de tamanho len
 * @param {number} len - Tamanho da string a ser criada
 * @param {object} client - Instância do client com método random
 * @param {boolean} hash_case - Se true, usa apenas letras e números para que sejam gerados hashes compatíveis com botões e menus
 * @returns {string}
 */

function randomString(len, client, hash_case) {

    if (!client || typeof client.random !== 'function')
        throw new Error('O parâmetro client deve possuir o método random.')

    if (!Number.isInteger(len) || len <= 0)
        throw new Error('O parâmetro len deve ser um número inteiro positivo.')

    let charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdeeͪfghijklmnopqrstuvwxyz0123456789!@#$%¨&*()^[]~.;:¢¬_-£"|?'

    if (hash_case) // Remove pontuações diferentes para casos de hash utilizados em botões e menus
        charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    let result = ''

    for (let i = 0; i < len; i++) {
        const randomPoz = client.random(charSet.length)
        result += charSet[randomPoz]
    }

    return shuffle(result).slice(0, len)
}

/**
 * Embaralha uma string
 * @param {string} str - String a ser embaralhada
 * @returns {string}
 */

function shuffle(str) {

    if (typeof str !== 'string') {
        console.error('shuffle: parâmetro não é uma string:', str)
        return ''
    }

    if (str.length <= 1) return str

    const arr = str.split('')

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }

    return arr.join('')
}

module.exports.randomString = randomString
module.exports.shuffle = shuffle