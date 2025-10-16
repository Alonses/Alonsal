const { PermissionsBitField } = require('discord.js')

const { listRankGuild } = require('../../database/schemas/User_rank_guild')
const { getNetworkedGuilds } = require('../../database/schemas/Guild')
const { checkUserGuildReported } = require('../../database/schemas/User_reports')
const { listAllGuildWarns } = require('../../database/schemas/Guild_warns')
const { defaultEraser, defaultUserEraser } = require('../../formatters/patterns/timeout')

module.exports = async ({ client, user, interaction, pagina_guia }) => {

    const rank = await listRankGuild(interaction.guild.id)
    const warns = await listAllGuildWarns(interaction.guild.id)
    const reportes = await checkUserGuildReported(client.encrypt(interaction.guild.id))

    const guild = await client.getGuild(interaction.guild.id), pagina = pagina_guia || 0
    const network = guild.network.link ? (await getNetworkedGuilds(guild.network.link)).length - 1 : 0

    const ephemeral = "Ephemeral"
    await client.deferedResponse({ interaction, ephemeral })

    let dados = ""
    let botoes = [{ id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: "panel_guild.0" }]

    if (pagina === 1)
        botoes = [{ id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: "panel_guild_data.0" }]

    if (guild.inviter)
        dados += `\n${client.emoji("aln_hoster")} **${client.tls.phrase(user, "manu.data.hoster_alonsal")}**\n${client.emoji("icon_id")} \`${guild.inviter}\`\n<@${guild.inviter}>\n`

    if (guild.misc.subscription.active) // Data de expiração do impulso
        dados += `\n${client.tls.phrase(user, "misc.assinante.validade_impulso_servidor")} ${guild.misc.subscription.expires ? `<t:${guild.misc.subscription.expires}:f>` : client.tls.phrase(user, "misc.assinante.assinatura_infinita")}\n`

    if (reportes.length > 0)
        dados += `\n${client.emoji(6)} **${client.tls.phrase(user, "manu.guild_data.reportes_criados")}**\n\`${reportes.length > 1 ? `${reportes.length} ${client.tls.phrase(user, "manu.guild_data.reportes")}` : `1 ${client.tls.phrase(user, "manu.guild_data.reporte")}`}\`\n`

    if (warns.length > 0)
        dados += `\n${client.emoji(0)} **${client.tls.phrase(user, "manu.guild_data.advertencias_ativas")}**\n\`${warns.length > 1 ? `${warns.length} ${client.tls.phrase(user, "manu.guild_data.advertencias")}` : `1 ${client.tls.phrase(user, "manu.guild_data.advertencia")}`}\`\n`

    if (rank.length > 0)
        dados += `\n${client.emoji(56)} **${client.tls.phrase(user, "manu.guild_data.ranking_servidor")}**\n\`${rank.length > 1 ? `${rank.length} ${client.tls.phrase(user, "manu.guild_data.membros")}` : `1 ${client.tls.phrase(user, "manu.guild_data.membro")}`}\`\n`

    if (network > 0) {
        dados += `\n${client.emoji(36)} **Network**\n\`${network > 1 ? client.tls.phrase(user, "manu.guild_data.network_servidores", null, network) : client.tls.phrase(user, "manu.guild_data.network_unico")}\``
        dados += `\n\n:link: **${client.tls.phrase(user, "manu.guild_data.outros_servidores")} ( \`${network} / ${guild.misc?.subscription.active ? "29" : "9"}\`)**\n${guild.network.link ? await client.execute("getNetworkGuildNames", { user, link: guild.network.link, interaction, ignore: true }) : client.tls.phrase(user, "manu.guild_data.sem_servidores")}\n`
    }

    const embed = client.create_embed({
        title: { tls: "manu.guild_data.dados_servidor_titulo" },
        fields: [
            {
                name: `${client.execute("button_emoji", guild?.conf.logger)} **${client.tls.phrase(user, "manu.painel.log_eventos")}**`,
                value: `${client.execute("button_emoji", guild?.conf.network)} **Network**\n${client.execute("button_emoji", guild?.conf.tickets)} **${client.tls.phrase(user, "manu.painel.denuncias_server")}**`,
                inline: true
            },
            {
                name: `${client.execute("button_emoji", guild?.conf.warn)} **${client.tls.phrase(user, "mode.warn.advertencias")}**`,
                value: `${client.execute("button_emoji", guild?.conf.reports)} **${client.tls.phrase(user, "manu.painel.reports_externos")}**\n${client.execute("button_emoji", guild?.conf.voice_channels)} **Faladeiros dinâmicos**`,
                inline: true
            },
            {
                name: `${client.execute("button_emoji", guild?.conf.spam)} **${client.tls.phrase(user, "manu.painel.anti_spam")}**`,
                value: `${client.execute("button_emoji", guild?.conf.games)} **${client.tls.phrase(user, "manu.painel.anuncio_games")}**\n${client.execute("button_emoji", guild?.conf.nuke_invites)} **${client.tls.phrase(user, "manu.painel.convites_rastreados")}**`,
                inline: true
            }
        ],
        footer: {
            text: { tls: "manu.guild_data.opcoes_rodape" },
            iconURL: interaction.user.avatarURL({ dynamic: true })
        }
    }, user)

    if (pagina === 0) embed.setDescription(client.tls.phrase(user, "manu.guild_data.resumo_dados", null, dados))
    else {

        let tempo_exclusao = ""

        if (guild.erase.timeout)
            tempo_exclusao = `\n**${client.defaultEmoji("time")} ${client.tls.phrase(user, "manu.guild_data.tempo_exclusao")}**:\n${client.tls.phrase(user, "manu.guild_data.excluir_apos", null, defaultEraser[guild.erase.timeout] / 86400)}`

        if (guild.iddle.timeout) // Saída automática após X tempo de inatividade do bot no servidor
            tempo_exclusao += `\n**${client.defaultEmoji("running")} ${client.tls.phrase(user, "manu.guild_data.saida_automatica", null, client.tls.phrase(user, `menu.times.${defaultUserEraser[guild.iddle.timeout]}`))}\n`

        embed.setDescription(client.tls.phrase(user, "manu.guild_data.resumo_expandido", null, tempo_exclusao))
    }

    botoes.push({ id: "data_guild_button", name: { tls: "menu.botoes.atualizar" }, type: 0, emoji: client.emoji(42), data: "0" })

    // Verificando se o membro possui permissões para gerenciar o tempo de exclusão do servidor
    if (await client.execute("permissions", { interaction, id_user: interaction.user.id, permissions: [PermissionsBitField.Flags.ManageGuild] }))
        botoes.push(
            { id: "data_guild_button", name: { tls: "menu.botoes.definir_exclusao" }, type: 3, emoji: client.defaultEmoji("time"), data: "2" },
            { id: "data_guild_button", name: { tls: "menu.botoes.definir_inatividade" }, type: 3, emoji: client.defaultEmoji("running"), data: "3" }
        )

    if (pagina === 0)
        botoes.push({ id: "data_guild_button", name: { tls: "menu.botoes.mais_detalhes" }, type: 0, emoji: client.defaultEmoji("paper"), data: "1" })

    interaction.editReply({
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction, user)],
        flags: "Ephemeral"
    })
}