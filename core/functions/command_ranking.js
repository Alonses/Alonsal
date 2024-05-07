const { writeFileSync, existsSync } = require('fs')

const { comandos } = require('../../files/data/comandos.json')

module.exports = async function ({ client, message, content }) {

    let indice = null, alias = null
    const procura_infos = content.replace(prefix, "").split(" ")[0].replace(/ /g, "")

    for (let x = 0; x < comandos.length; x++) {
        let linha = comandos[x].split(",")
        const aliases = linha

        for (let i = 1; i < aliases.length; i++) { // Procurando se o comando existe
            if (aliases[i].replace(/ /g, "") === procura_infos) {
                indice = linha[0]
                alias = linha
                valida_aliase = true
                break
            }
        }
    }

    if (indice === null) return // Confirma a existencia do comando

    alias.shift()

    const command = {
        id: indice,
        aliases: alias,
        activations: 0
    }

    if (existsSync(`./files/data/command_rank/${indice}.json`)) {
        delete require.cache[require.resolve(`../files/data/command_rank/${indice}.json`)]
        const { activations, aliases } = require(`../files/data/command_rank/${indice}.json`)
        command.activations = activations
        command.aliases = aliases
    }

    command.activations++

    writeFileSync(`./files/data/command_rank/${indice}.json`, JSON.stringify(command))
    delete require.cache[require.resolve(`../files/data/command_rank/${indice}.json`)]
}