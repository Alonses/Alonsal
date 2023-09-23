componentToHex = (c) => {
    let hex = c.toString(16)
    return hex.length === 1 ? `0${hex}` : hex
}

random = (valor) => {
    return Math.round(valor * Math.random())
}

function rgbToHex(r, g, b) {
    return `${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`
}

function alea_hex() {
    return rgbToHex(random(255), random(255), random(255))
}

module.exports = {
    rgbToHex,
    alea_hex
}