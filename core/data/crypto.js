const crypto = require("crypto")

/**
 * Formato v2 (AES-256-GCM, autenticado):
 *  - "d.<base64url>": determinístico (IV sintético via HMAC do texto), mantém igualdade para buscas no banco
 *  - "r.<base64url>": IV aleatório, para dados que nunca são buscados/comparados
 * Payload = iv(12) | tag(16) | ciphertext
 */
const secret = process.env.salt

if (!secret || secret.length < 32)
    throw new Error(`🛑 | A variável 'salt' do .env deve ter ao menos 32 caracteres (lida: ${secret?.length || 0}). Evite aspas, # e barras dentro do valor`)

const derive = info => Buffer.from(crypto.hkdfSync("sha256", secret, "alonsal-crypto-v2", info, 32))

// Chaves independentes para cifrar e para gerar o IV determinístico
const enc_key = derive("encryption")
const iv_key = derive("synthetic-iv")

const IV_LEN = 12, TAG_LEN = 16
const PREFIX_DET = "d.", PREFIX_RND = "r."

// Cache limitado: a decifragem/cifra determinística de uma mesma entrada nunca muda
const CACHE_LIMIT = 5000
const enc_cache = new Map()
const dec_cache = new Map()

function cached(map, entry, fn) {

    if (map.has(entry)) return map.get(entry)

    const result = fn()

    if (map.size >= CACHE_LIMIT) map.delete(map.keys().next().value)
    map.set(entry, result)

    return result
}

function seal(text, iv, prefix) {

    const cipher = crypto.createCipheriv("aes-256-gcm", enc_key, iv)
    const data = Buffer.concat([cipher.update(text, "utf8"), cipher.final()])

    return prefix + Buffer.concat([iv, cipher.getAuthTag(), data]).toString("base64url")
}

// Determinístico: o mesmo texto sempre gera o mesmo resultado (usar apenas em IDs e valores comparáveis)
function data_encrypt(data_text) {

    data_text = String(data_text)

    return cached(enc_cache, data_text, () => {
        const iv = crypto.createHmac("sha256", iv_key).update(data_text).digest().subarray(0, IV_LEN)
        return seal(data_text, iv, PREFIX_DET)
    })
}

// IV aleatório: resultados diferentes a cada chamada (não usar em campos buscados por igualdade)
function data_encrypt_random(data_text) {
    return seal(String(data_text), crypto.randomBytes(IV_LEN), PREFIX_RND)
}

function data_decipher(encrypted) {

    if (typeof encrypted !== "string") return encrypted

    // Valores sem prefixo não foram cifrados por este módulo
    if (!encrypted.startsWith(PREFIX_DET) && !encrypted.startsWith(PREFIX_RND)) return encrypted

    return cached(dec_cache, encrypted, () => {
        try {
            const raw = Buffer.from(encrypted.slice(2), "base64url")

            const iv = raw.subarray(0, IV_LEN)
            const tag = raw.subarray(IV_LEN, IV_LEN + TAG_LEN)
            const data = raw.subarray(IV_LEN + TAG_LEN)

            const decipher = crypto.createDecipheriv("aes-256-gcm", enc_key, iv)
            decipher.setAuthTag(tag)

            return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8")
        } catch {
            console.error("🛑 | Falha ao decifrar um dado (chave incorreta ou dado adulterado)")
            return null
        }
    })
}

module.exports = {
    data_encrypt,
    data_encrypt_random,
    data_decipher
}
