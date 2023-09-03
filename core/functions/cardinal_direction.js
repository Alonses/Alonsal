module.exports = (degrees) => {

    const cards = ["⬆️", "↗️", "➡️", "↘️", "⬇️", "↙️", "⬅️", "↖️"]
    degrees += 22.5

    if (degrees < 0)
        degrees = 360 - Math.abs(degrees) % 360
    else
        degrees = degrees % 360

    return cards[parseInt(degrees / 45)]
}