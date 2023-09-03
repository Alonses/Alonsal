const { listAllUserModules } = require('../../database/schemas/Module')
// const formata_horas = require('../../formatters/formata_horas')

module.exports = async ({ client, user, interaction }) => {

    // Listando todos os módulos do usuário
    let modulos = await listAllUserModules(interaction.user.id)

    // Atualizando o horário de módulos legados
    // for (let i = 0; i < modulos.length; i++) {

    //     let hora = formata_horas(modulos[i].stats.hour.split(":")[0])
    //     let minuto = '00'

    //     if (modulos[i].stats.hour.split(":")[1])
    //         minuto = formata_horas(modulos[i].stats.hour.split(":")[1])

    //     modulos[i].stats.hour = `${hora}:${minuto}`
    //     modulos[i].save()
    // }

    // Verificando se há modulos configurados
    if (modulos.length < 1)
        return client.tls.reply(interaction, user, "misc.modulo.sem_modulo", true, client.emoji(0))

    const data = {
        title: client.tls.phrase(user, "misc.modulo.modulo_escolher", 1),
        alvo: "modulo_visualizar",
        values: modulos
    }

    if (!interaction.customId) // Interação original
        interaction.reply({
            content: data.title,
            embeds: [],
            components: [client.create_menus(client, interaction, user, data)],
            ephemeral: client.decider(user?.conf.ghost_mode, 0)
        })
    else // Interação por botões/menus
        interaction.update({
            content: data.title,
            embeds: [],
            components: [client.create_menus(client, interaction, user, data)],
            ephemeral: client.decider(user?.conf.ghost_mode, 0)
        })
}