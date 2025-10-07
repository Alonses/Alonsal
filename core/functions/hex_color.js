/**
 * Converte um componente RGB para hexadecimal
 * @param {number} c - Valor do componente (0-255)
 * @returns {string}
 */
const componentToHex = (c) => {
    const value = Math.max(0, Math.min(255, Math.round(c)))
    const hex = value.toString(16)
    return hex.length === 1 ? `0${hex}` : hex
}

/**
 * Gera um valor inteiro aleatório entre 0 e valor
 * @param {number} valor
 * @returns {number}
 */
const random = (valor) => {
    return Math.floor(Math.random() * (valor + 1))
}

/**
 * Converte valores RGB para hexadecimal CSS (#RRGGBB)
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {string}
 */
const rgbToHex = (r, g, b) => {
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`
}

/**
 * Gera uma cor hexadecimal aleatória
 * @returns {string}
 */
const alea_hex = () => {
    return rgbToHex(random(255), random(255), random(255))
}

module.exports.rgbToHex = rgbToHex
module.exports.alea_hex = alea_hex