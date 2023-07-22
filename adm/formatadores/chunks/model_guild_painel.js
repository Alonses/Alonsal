const { EmbedBuilder, PermissionsBitField } = require('discord.js')

const { emoji_button, type_button } = require('../../funcoes/emoji_button')

module.exports = async (client, user, interaction, pagina) => {

    const guild = await client.getGuild(interaction.guild.id)
    const membro_sv = await client.getUserGuild(interaction, interaction.user.id)

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(user, "manu.painel.cabecalho_menu"))
        .setColor(client.embed_color(user.misc.color))
        .setDescription(client.tls.phrase(user, "manu.painel.descricao"))
        .setFooter({ text: client.tls.phrase(user, "manu.painel.rodape"), iconURL: interaction.user.avatarURL({ dynamic: true }) })

    if (typeof pagina === "undefined")
        pagina = 0

    if (pagina === 0)
        embed.addFields(
            {
                name: `**${emoji_button(guild?.conf.conversation)} Alonsal Falador**`,
                value: "`O Alonsal poderá responder outros usuários se incluirem seu nome em alguma mensagem`",
                inline: true
            },
            {
                name: `**${emoji_button(guild?.conf.broadcast)} Permitir Broadcast**`,
                value: "`Usuários do servidor podem conversar com o Slondo usando o Alonsal neste servidor através do comando`\n</broadcast:1114316224663396472>",
                inline: true
            },
            {
                name: `**${emoji_button(guild?.conf.games)} Anúncio de Games**`,
                value: "`O Alonsal enviará anúncios de jogos gratuitos automaticamente.`",
                inline: true
            }
        )

    if (pagina == 1)
        embed.addFields(
            {
                name: `**${emoji_button(guild?.conf.tickets)} Denúncias In-server**`,
                value: "`Usuários podem usar o Alonsal para fazer denúncias dentro do próprio servidor.`",
                inline: true
            },
            {
                name: `**${emoji_button(guild?.conf.reports)} Reports Externos**`,
                value: "`Reportes de usuários mau comportados serão enviados no servidor.`",
                inline: true
            },
            {
                name: `**${emoji_button(guild?.conf.logger)} Log de eventos**`,
                value: "`Log de eventos do servidor`",
                inline: true
            }
        )

    if (pagina == 2)
        embed.addFields(
            {
                name: `**${emoji_button(guild?.conf.spam)} Anti-spam**`,
                value: "`Mensagens que forem consideradas spam serão apagadas e o autor será castigado.`",
                inline: true
            },
            {
                name: `**${emoji_button(guild?.conf.public)} Visível globalmente**`,
                value: "`O Nome do servidor será exibido no comando`\n</rank global:1018609879562334383>",
                inline: true
            },
            {
                name: `**${emoji_button(0)} Misterioso**`,
                value: "`Uma ceira misteriosa será incluida aqui futuramente`",
                inline: true
            }
        )

    const c_buttons = [false, false, false, false, false, false, false, false]
    const c_menu = [false, false]

    if (pagina == 0) // Botão de voltar
        c_menu[0] = true
    if (pagina == 2) // Botão para avançar
        c_menu[1] = true

    let botoes = [{ id: "menu_guild_painel_button", name: '◀️', type: 0, data: `${pagina}.0`, disabled: c_menu[0] }]

    // Falta de permissões para gerenciar o sistema de denúncias
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageChannels) && !membro_sv.permissions.has(PermissionsBitField.Flags.ManageRoles))
        c_buttons[3] = true

    // Falta de permissões para gerenciar o sistema de reportes, o alonsal falante, o broadcast entre servidores
    // o Log de eventos e o módulo anti-spam
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        c_buttons[0] = true
        c_buttons[1] = true
        c_buttons[4] = true
        c_buttons[5] = true
        c_buttons[6] = true
    }

    // Falta de permissões para gerenciar o servidor no ranking global e o anúncios de games
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
        c_buttons[2] = true
        c_buttons[7] = true
    }

    // Primeira página de botões de configuração do Alonsal
    // Alonsal Falador; Broadcast e Anúncio de games
    if (pagina === 0)
        botoes = botoes.concat([{ id: "guild_painel_button", name: 'Alonsal Falador', type: type_button(guild?.conf.conversation), emoji: emoji_button(guild?.conf.conversation), data: '1', disabled: c_buttons[0] }, { id: "guild_painel_button", name: 'Permitir Broadcast', type: type_button(guild?.conf.broadcast), emoji: emoji_button(guild?.conf.broadcast), data: '2', disabled: c_buttons[1] }, { id: "guild_painel_button", name: 'Anúncio de Games', type: type_button(guild?.conf.games), emoji: emoji_button(guild?.conf.games), data: '3', disabled: c_buttons[2] }])

    // Segunda página de botões de configuração do Alonsal
    // Denúncias in-server; Reportes externos e Log de eventos
    if (pagina === 1)
        botoes = botoes.concat([{ id: "guild_painel_button", name: 'Denúncias In-server', type: type_button(guild?.conf.tickets), emoji: emoji_button(guild?.conf.tickets), data: '4', disabled: c_buttons[3] }, { id: "guild_painel_button", name: 'Reports externos', type: type_button(guild?.conf.reports), emoji: emoji_button(guild?.conf.reports), data: '5', disabled: c_buttons[4] }, { id: "guild_painel_button", name: 'Log de eventos', type: type_button(guild?.conf.logger), emoji: emoji_button(guild?.conf.logger), data: '6', disabled: c_buttons[5] }])

    // Terceira página de botões de configuração do Alonsal
    // Módulo anti-spam e Visibilidade Global
    if (pagina === 2)
        botoes = botoes.concat([{ id: "guild_painel_button", name: 'Anti-spam', type: type_button(guild?.conf.spam), emoji: emoji_button(guild?.conf.spam), data: '7', disabled: c_buttons[6] }, { id: "guild_painel_button", name: 'Visível Globalmente', type: type_button(guild?.conf.public), emoji: emoji_button(guild?.conf.public), data: '8', disabled: c_buttons[7] }, { id: "guild_painel_button", name: 'Misterioso', type: type_button(0), emoji: emoji_button(0), data: 'X', disabled: true }])

    botoes.push({ id: "menu_guild_painel_button", name: '▶️', type: 0, data: `${pagina}.1`, disabled: c_menu[1] })

    const row = client.create_buttons(botoes, interaction)

    if (!interaction.customId)
        interaction.reply({ content: "", embeds: [embed], components: [row], ephemeral: true })
    else
        interaction.update({ content: "", embeds: [embed], components: [row], ephemeral: true })
}