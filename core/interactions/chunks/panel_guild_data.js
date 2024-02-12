const { EmbedBuilder, PermissionsBitField } = require('discord.js')

const { listRankGuild } = require('../../database/schemas/Rank_s')
const { getNetworkedGuilds, defaultEraser } = require('../../database/schemas/Guild')
const { checkUserGuildReported } = require('../../database/schemas/Report')
const { listAllGuildWarns } = require('../../database/schemas/Warns_guild')

module.exports = async ({ client, user, interaction, operador, pagina_guia }) => {

    const guild = await client.getGuild(interaction.guild.id), pagina = pagina_guia || 0
    const reportes = await checkUserGuildReported(interaction.guild.id)
    const warns = await listAllGuildWarns(interaction.guild.id)
    const rank = await listRankGuild(interaction.guild.id)
    const network = guild.network.link ? (await getNetworkedGuilds(guild.network.link)).length - 1 : 0

    const membro_sv = await client.getMemberGuild(interaction, interaction.user.id)

    let dados = ""
    let botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild.0" }]

    if (pagina === 1)
        botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild_data.0" }]

    if (guild.inviter)
        dados += `\n${client.emoji("aln_hoster")} **Adicionou-me ao servidor**\n${client.emoji("icon_id")} \`${guild.inviter}\`\n<@${guild.inviter}>\n`

    if (reportes.length > 0)
        dados += `\n${client.emoji(6)} **Reportes criados**\n\`${reportes.length > 1 ? `${reportes.length} reportes` : `1 reporte`}\`\n`

    if (warns.length > 0)
        dados += `\n${client.emoji(0)} **Advertências ativas**\n\`${warns.length > 1 ? `${warns.length} advertências` : `1 advertência`}\`\n`

    if (rank.length > 0)
        dados += `\n${client.emoji(56)} **Ranking do servidor**\n\`${rank.length > 1 ? `${rank.length} membros` : `1 membro`}\`\n`

    if (network > 1) {
        dados += `\n${client.emoji(36)} **Network**\n\`${network > 1 ? `Faz networking com outros ${network} servidores` : `Faz networking com um outro servidor`}\``
        dados += `\n:link: **Outros servidores no link:**\n${guild.network.link ? await client.getNetWorkGuildNames(guild.network.link, interaction) : "`Sem servidores`"}\n`
    }

    const embed = new EmbedBuilder()
        .setTitle(`> Dados do servidor :globe_with_meridians:`)
        .setColor(client.embed_color(user.misc.color))
        .setFields(
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", guild?.conf.logger)} **${client.tls.phrase(user, "manu.painel.log_eventos")}**`,
                value: `${client.execute("functions", "emoji_button.emoji_button", guild?.conf.network)} **Network**\n${client.execute("functions", "emoji_button.emoji_button", guild?.conf.tickets)} **${client.tls.phrase(user, "manu.painel.denuncias_server")}**\n${client.execute("functions", "emoji_button.emoji_button", guild?.conf.broadcast)} **${client.tls.phrase(user, "manu.painel.permitir_broadcast")}**`,
                inline: true
            },
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", guild?.conf.warn)} **${client.tls.phrase(user, "mode.warn.advertencias")}**`,
                value: `${client.execute("functions", "emoji_button.emoji_button", guild?.conf.reports)} **${client.tls.phrase(user, "manu.painel.reports_externos")}**\n${client.execute("functions", "emoji_button.emoji_button", guild?.conf.conversation)} **${client.tls.phrase(user, "manu.painel.alonsal_falador")}**`,
                inline: true
            },
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", guild?.conf.spam)} **${client.tls.phrase(user, "manu.painel.anti_spam")}**`,
                value: `${client.execute("functions", "emoji_button.emoji_button", guild?.conf.games)} **${client.tls.phrase(user, "manu.painel.anuncio_games")}**\n${client.execute("functions", "emoji_button.emoji_button", guild?.conf.nuke_invites)} **Convites rastreados**`,
                inline: true
            }
        )
        .setFooter({
            text: "Configure opções de exclusão abaixo",
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    if (pagina === 0)
        embed.setDescription(`Este é um resumo dos dados que salvei sobre o servidor e seus membros\n${dados}\n**Recursos do servidor:**`)
    else {

        let tempo_exclusao = ""

        if (guild.erase.timeout)
            tempo_exclusao = `\n**${client.defaultEmoji("time")} Tempo de exclusão**:\nExcluir dados após \`${defaultEraser[guild.erase.timeout] / 86400} dias\`\n`

        embed.setDescription(`\`\`\`fix\nAo ser removido do servidor, o Alonsal irá desativar a maioria dos recursos listados abaixo.\n\nA exclusão dos dados será realizada após um período de forma automática, você pode definir esse tempo através dos botões abaixo.\n\nAo apagar os dados, o Alonsal irá remover completamente os dados salvos do servidor, incluindo o registro de ranking, a redefinição da origem de reportes e links suspeitos e remoção de advertências salvas.\`\`\`${tempo_exclusao}\n**Recursos do servidor:**`)
    }

    botoes.push({ id: "data_guild_button", name: client.tls.phrase(user, "menu.botoes.atualizar"), type: 1, emoji: client.emoji(42), data: "0" })

    // Verificando se o membro possui permissões para gerenciar o tempo de exclusão do servidor
    if (await client.permissions(interaction, interaction.user.id, [PermissionsBitField.Flags.ManageGuild]))
        botoes.push({ id: "data_guild_button", name: "Definir exclusão", type: 3, emoji: client.defaultEmoji("time"), data: "2" })

    if (pagina === 0)
        botoes.push({ id: "data_guild_button", name: "Mais detalhes", type: 1, emoji: client.defaultEmoji("paper"), data: "1" })

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: true
    })
}