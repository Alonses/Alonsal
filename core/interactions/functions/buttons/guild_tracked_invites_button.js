// 1 -> Ativar ou desativar os convites rastreados
// 2 -> Altera o tipo de filtro dos convites rastreados

const { ChannelType } = require('discord.js')

const operations = {
    1: { action: "conf.nuke_invites", page: 0 },
    2: { action: "nuke_invites.type", page: 0 }
}

module.exports = async ({ client, user, interaction, dados, pagina }) => {

    const operacao = parseInt(dados.split(".")[1]), reback = "panel_guild_tracked_invites"
    let guild = await client.getGuild(interaction.guild.id)

    if (operations[operacao]) {
        ({ guild, pagina_guia } = client.switcher({ guild, operations, operacao }))
        await guild.save()
    } else if (operacao === 3) {

        let canal = guild.nuke_invites.channel ? guild.nuke_invites.channel : guild.logger.channel, alvo = "guild_tracked_invites#channel"

        // Definindo o canal de avisos do rastreador de convites
        const data = {
            title: { tls: "menu.menus.escolher_canal" },
            pattern: "choose_channel",
            alvo: alvo,
            reback: "browse_button.guild_tracked_invites_button",
            operation: operacao,
            values: await client.getGuildChannels(interaction, user, ChannelType.GuildText, canal)
        }

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (data.values.length < pagina * 24) pagina--

        const row = client.menu_navigation(user, data, pagina || 0)
        let botoes = [
            { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 0, emoji: client.emoji(19), data: reback },
            { id: "guild_tracked_invites_button", name: { tls: "menu.botoes.atualizar" }, type: 1, emoji: client.emoji(42), data: operacao }
        ]

        if (row.length > 0) // Botões de navegação
            botoes = botoes.concat(row)

        return interaction.update({
            components: [client.create_menus({ interaction, user, data, pagina }), client.create_buttons(botoes, interaction, user)],
            flags: "Ephemeral"
        })
    }

    // Redirecionando a função para o painel dos convites rastreados
    require('../../chunks/panel_guild_tracked_invites')({ client, user, interaction })
}