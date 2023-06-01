const { EmbedBuilder, PermissionsBitField } = require('discord.js')

const { getGuild } = require('../../database/schemas/Guild')

const { emoji_button, type_button } = require('../../funcoes/emoji_button')

module.exports = async (client, user, interaction, pagina) => {

    const guild = await getGuild(interaction.guild.id)
    const membro_sv = await client.getUserGuild(interaction, interaction.user.id)

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(user, "manu.painel.cabecalho_menu"))
        .setColor(client.embed_color(user.misc.color))
        .setDescription(client.tls.phrase(user, "manu.painel.descricao"))
        .setFooter({ text: client.tls.phrase(user, "manu.painel.rodape"), iconURL: interaction.user.avatarURL({ dynamic: true }) })

    if (pagina === 0) {
        embed.addFields(
            {
                name: `**${emoji_button(guild?.conf.conversation)} Alonsal Falador**`,
                value: "`O Alonsal poderá responder outros usuários se incluirem seu nome em alguma mensagem`",
                inline: true
            },
            {
                name: `**${emoji_button(guild?.conf.broadcast)} Permitir Broadcast**`,
                value: "`Usuários do servidor podem conversar com o Slondo usando o Alonsal neste servidor através do comando`\n/broadcast",
                inline: true
            },
            {
                name: `**${emoji_button(guild?.conf.games)} Anúncio de Games**`,
                value: "`O Alonsal enviará anúncios de jogos gratuitos automaticamente.`",
                inline: true
            }
        )
    } else {
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
                name: `**${emoji_button(guild?.conf.public)} Visível globalmente**`,
                value: "`O Nome do servidor será exibido no comando`\n</rank global:1018609879562334383>",
                inline: true
            }
        )
    }

    if (typeof pagina === "undefined")
        pagina = 0

    const c_buttons = [false, false, false, false, false, false]
    const c_menu = [false, false]

    c_menu[pagina] = true

    let botoes = [{ id: "menu_guild_painel_button", name: 'Retornar', value: '1', type: 0, emoji: '◀️', data: '0', disabled: c_menu[0] }]

    // Falta de permissões para gerenciar o sistema de denúncias
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageChannels) && !membro_sv.permissions.has(PermissionsBitField.Flags.ManageRoles))
        c_buttons[3] = true

    // Falta de permissões para gerenciar o sistema de reportes, o alonsal falante e o broadcast entre servidores
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        c_buttons[0] = true
        c_buttons[1] = true
        c_buttons[4] = true
    }

    // Falta de permissões para gerenciar o servidor no ranking global e o anúncios de games
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
        c_buttons[2] = true
        c_buttons[5] = true
    }

    // Primeira página de botões de configuração do Alonsal
    // Alonsal Falador; Broadcast e Anúncio de games
    if (pagina === 0)
        botoes = botoes.concat([{ id: "guild_painel_button", name: 'Alonsal Falador', value: '1', type: type_button(guild?.conf.conversation), emoji: emoji_button(guild?.conf.conversation), data: '1', disabled: c_buttons[0] }, { id: "guild_painel_button", name: 'Permitir Broadcast', value: '1', type: type_button(guild?.conf.broadcast), emoji: emoji_button(guild?.conf.broadcast), data: '2', disabled: c_buttons[1] }, { id: "guild_painel_button", name: 'Anúncio de Games', value: '1', type: type_button(guild?.conf.games), emoji: emoji_button(guild?.conf.games), data: '3', disabled: c_buttons[2] }])

    // Segunda página de botões de configuração do Alonsal
    // Denúncias in-server; Reportes externos e Visibilidade Global
    if (pagina === 1)
        botoes = botoes.concat([{ id: "guild_painel_button", name: 'Denúncias In-server', value: '1', type: type_button(guild?.conf.tickets), emoji: emoji_button(guild?.conf.tickets), data: '4', disabled: c_buttons[3] }, { id: "guild_painel_button", name: 'Reports externos', value: '1', type: type_button(guild?.conf.reports), emoji: emoji_button(guild?.conf.reports), data: '5', disabled: c_buttons[4] }, { id: "guild_painel_button", name: 'Visível Globalmente', value: '1', type: type_button(guild?.conf.public), emoji: emoji_button(guild?.conf.public), data: '6', disabled: c_buttons[5] }])

    botoes.push({ id: "menu_guild_painel_button", name: 'Avançar', value: '1', type: 0, emoji: '▶️', data: '1', disabled: c_menu[1] })

    const row = client.create_buttons(botoes, interaction)

    if (!interaction.customId)
        interaction.reply({ content: "", embeds: [embed], components: [row], ephemeral: true })
    else
        interaction.update({ content: "", embeds: [embed], components: [row], ephemeral: true })
}