const { spamTimeoutMap } = require("../formatters/patterns/timeout")

module.exports = ({ client, data }) => {

    const obj = data.action
    const chave_traducao = data.source

    // Verifica se a ação do servidor é silenciar um membro, caso positivo, retorna o tempo de mute do servidor
    return obj.action === "member_mute" ? `\n${client.defaultEmoji("time")} **${client.tls.phrase(chave_traducao, "mode.spam.tempo")}:** \`${client.tls.phrase(chave_traducao, `menu.times.${spamTimeoutMap[obj.timeout]}`)}\`` : ""
}