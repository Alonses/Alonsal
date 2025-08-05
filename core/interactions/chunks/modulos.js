const { listAllUserModules } = require('../../database/schemas/User_modules')

module.exports = async ({ client, user, interaction }) => {

    // Listando todos os módulos do usuário
    const modulos = await listAllUserModules(user.uid)

    // Verificando se há modulos configurados
    if (modulos.length < 1)
        return client.tls.report(interaction, user, "misc.modulo.sem_modulo", true, client.emoji(0), true)

    const data = {
        title: { tls: "misc.modulo.selecionar_modulo", emoji: 1 },
        pattern: "modules_browse",
        alvo: "modules_browse",
        values: modulos
    }

    const obj = {
        content: client.tls.phrase(user, "misc.modulo.modulo_escolher"),
        embeds: [],
        components: [client.create_menus({ interaction, user, data })],
        flags: "Ephemeral"
    }

    client.reply(interaction, obj)
}