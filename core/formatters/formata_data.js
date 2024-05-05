const { months } = require("./patterns/general")

module.exports = (data) => {

    if (!data) return "0"

    const ano = data.split(" ")[2]
    let mes = data.split(" ")[1]
    const dia = data.split(" ")[0]

    if (months[mes]) mes = months[mes]

    return new Date(`${ano} ${mes} ${dia}`).getTime() / 1000
}