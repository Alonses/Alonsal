const { cases } = require("./patterns/general")

module.exports = (string) => {

    if (!string) return "`Sem texto`"

    // Removendo espaços desnecessários
    string = string.trim().replace(/\s+/g, ' ')

    Object.keys(cases).forEach(chave => {

        if (string.includes(chave)) // Substituindo a ocorrência pelo texto esperado
            string = string.replaceAll(chave, cases[chave])
    })

    if (string.length > 2000)
        string = `${string.slice(0, 1995)}...`

    return string
}