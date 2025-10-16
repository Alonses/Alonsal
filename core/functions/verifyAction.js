const { loggerMap } = require("../formatters/patterns/guild")

module.exports = ({ client, data }) => {

    const obj = data.action
    const chave_traducao = data.source

    // Lista as penalidades que o usuário receberá com a advertência
    let acao_advertencia = `${loggerMap[obj.action] || loggerMap["none"]} \`${client.tls.phrase(chave_traducao, `menu.events.${obj.action || "none"}`)}\`${client.execute("guildAction", { action: obj, source: chave_traducao })}`

    if (obj.role) // Advertência com cargo aplicado
        acao_advertencia += `\n:label: <@&${obj.role}>${obj.timed_role.status ? ` ( \`${client.defaultEmoji("time")} ${client.tls.phrase(chave_traducao, `menu.times.${defaultRoleTimes[obj.timed_role.timeout]}`)}\` )` : ""}`

    return acao_advertencia
}