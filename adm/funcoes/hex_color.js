function componentToHex(c) {
    var hex = c.toString(16)
    return hex.length === 1 ? `0${hex}` : hex
}

function rgbToHex(r, g, b) { return `0x${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}` }

function alea_hex() { return rgbToHex(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)) }

module.exports = {
    alea_hex
}