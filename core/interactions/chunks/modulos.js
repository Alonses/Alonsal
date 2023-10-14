const { listAllUserModules } = require('../../database/schemas/Module')

module.exports = async ({ client, user, interaction, autor_original }) => {

    // Listando todos os módulos do usuário
    let modulos = await listAllUserModules(interaction.user.id)

    // Verificando se há modulos configurados
    if (modulos.length < 1)
        if (!interaction.customId || !autor_original)
            return interaction.reply({
                content: client.tls.phrase(user, "misc.modulo.sem_modulo", client.emoji(0)),
                embeds: [],
                components: [],
                ephemeral: true
            })
        else
            return client.tls.report(interaction, user, "misc.modulo.sem_modulo", true, client.emoji(0), null, true)

    const data = {
        title: client.tls.phrase(user, "misc.modulo.modulo_escolher", 1),
        alvo: "modulo_visualizar",
        values: modulos
    }

    const obj = {
        content: data.title,
        embeds: [],
        components: [client.create_menus({ client, interaction, user, data })],
        ephemeral: client.decider(user?.conf.ghost_mode, 0)
    }

    if (!autor_original)
        obj.ephemeral = true

    client.reply(interaction, obj)
}