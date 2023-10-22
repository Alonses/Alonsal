const { PermissionsBitField } = require('discord.js')

module.exports = async ({ client, user, interaction, dados, pagina }) => {

    let operacao = parseInt(dados.split(".")[1]), reback = "panel_guild_network"
    const guild = await client.getGuild(interaction.guild.id)

    if (!guild.network.link) {
        reback = "panel_guild.1"
        operacao = 3
    }

    // Tratamento dos cliques
    // 0 -> Entrar no painel de cliques
    // 1 -> Ativar ou desativar o network do servidor
    // 2 -> Escolher os eventos sincronizados no servidor

    if (operacao === 1) { // Ativa ou desativa o network do servidor
        guild.conf.network = !guild.conf.network
    } else if (operacao === 2) {

        const eventos = []

        Object.keys(guild.network).forEach(evento => {
            if (evento !== "link")
                eventos.push({ type: evento, status: guild.network[evento] })
        })

        // Definindo os eventos que o log irá relatar no servidor
        const data = {
            title: client.tls.phrase(user, "misc.modulo.modulo_escolher", 1),
            alvo: "guild_network#events",
            reback: "browse_button.guild_network_button",
            operation: operacao,
            values: eventos
        }

        const botoes = client.create_buttons([{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild_network" }], interaction)
        const multi_select = true

        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data, pagina, multi_select }), botoes],
            ephemeral: true
        })
    } else if (operacao === 3) { // Servidor sem um link de network

        // Listando todos os servidores que o usuário é moderador
        // Selecionando os servidores para vincular ao network
        const permissions = [PermissionsBitField.Flags.BanMembers, PermissionsBitField.Flags.ModerateMembers]
        const guilds = await client.getMemberGuildsByPermissions({ interaction, user, permissions })

        // Definindo os eventos que o log irá relatar no servidor
        const data = {
            title: "Selecione os servidores para se vincularem a este",
            alvo: "guild_network#link",
            reback: "browse_button.guild_network_button",
            operation: operacao,
            values: guilds
        }

        const botoes = client.create_buttons([{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: reback }], interaction)
        const multi_select = true

        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data, pagina, multi_select }), botoes],
            ephemeral: true
        })
    } else if (operacao === 4) {
        // Quebrando o link do servidor
        guild.conf.network = false
        guild.network.link = null
    }

    await guild.save()

    // Redirecionando a função para o painel do log de eventos
    require('../../chunks/panel_guild_network')({ client, user, interaction, operacao })
}