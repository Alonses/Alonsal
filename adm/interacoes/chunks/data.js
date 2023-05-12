module.exports = async ({ client, user, interaction }) => {

    return client.tls.reply(interaction, user, "inic.error.develop", true, 5)

    const opcoes = [1, 2, 3, 4]

    // for (let i = 0; i < 4; i++) {
    //     opcoes.push(client.tls.phrase(user, ""))
    // }

    const data = {
        alvo: "data",
        values: opcoes
    }

    if (!interaction.customId)
        interaction.reply({ content: client.tls.phrase(user, "menu.menus.selecionar_operacao"), components: [client.create_menus(client, interaction, user, data)], embeds: [], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
    else
        interaction.update({ content: client.tls.phrase(user, "menu.menus.selecionar_operacao"), components: [client.create_menus(client, interaction, user, data)], embeds: [], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
}