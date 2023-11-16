const { EmbedBuilder } = require('discord.js')

const { getUserReports } = require('../../database/schemas/Report')
const { getUserStrikes } = require("../../database/schemas/Strikes")
const { getUserWarns } = require('../../database/schemas/Warns')

module.exports = async ({ client, user, interaction, id_cache }) => {

    let id_alvo = id_cache || interaction.options.getUser("user").id
    const user_alvo = await client.getMemberGuild(interaction, id_alvo) // Dados de membro do servidor
        .catch(() => { return null })

    // Usuário não faz parte do servidor (caso o usuário saia do servidor enquanto o comando é executado)
    if (!user_alvo)
        return client.tls.reply(interaction, user, "mode.report.usuario_nao_encontrado", true, 1)

    // Coletando os dados de histórico do usuário
    const reports = await getUserReports(id_alvo)
    const user_c = await client.getUser(id_alvo)

    let apelido = user_alvo.nickname !== null ? user_alvo.nickname : user_alvo.user.username
    let avisos = 0, descricao = `\`\`\`✅ | ${client.tls.phrase(user, "mode.report.sem_report")}\`\`\``

    let user_name = `\`${user_alvo.user.username.replace(/ /g, "")}#${user_alvo.user.discriminator}\`\n( ${user_alvo} )`

    if (user_alvo.user.discriminator == 0)
        user_name = `\`@${user_alvo.user.username.replace(/ /g, "")}\`\n( ${user_alvo} )`

    // Avatar do usuário
    const avatar_user = user_alvo.user.avatarURL({ dynamic: true, size: 2048 }), historico = []
    const strikes = await getUserStrikes(id_alvo, interaction.guild.id)
    const warns = await getUserWarns(id_alvo, interaction.guild.id)

    // Quantificando os relatórios sobre o usuário
    reports.forEach(valor => {
        avisos++

        historico.push(`-> ${new Date(valor.timestamp * 1000).toLocaleDateString("pt-BR")} | ${valor.relatory}`)
    })

    if (avisos > 0)
        descricao = `\`\`\`💢 | ${client.tls.phrase(user, "mode.report.com_report")}\n\n${historico.join("\n").slice(0, 1000)}\`\`\``

    const infos_user = new EmbedBuilder()
        .setTitle(`> ${apelido}`)
        .setColor(client.embed_color(user_c.misc.color))
        .setDescription(descricao)
        .addFields(
            {
                name: `:bust_in_silhouette: **${client.tls.phrase(user, "mode.report.usuario")}**`,
                value: user_name,
                inline: true
            },
            {
                name: `${client.emoji("icon_id")} **${client.tls.phrase(user, "mode.report.identificador")}**`,
                value: `\`${user_alvo.id}\``,
                inline: true
            },
            {
                name: `:man_guard: **${client.tls.phrase(user, "mode.report.reporte")}: ${avisos}**`,
                value: `:name_badge: **Strikes: ${strikes.strikes}**\n**:mega: Warns: ${warns.total}**`,
                inline: true
            }
        )

    if (avatar_user)
        infos_user.setThumbnail(avatar_user)

    const obj = {
        embeds: [infos_user],
        components: [],
        ephemeral: true
    }

    const botoes = []

    if (strikes.strikes > 0) // Botão para resetar os strikes do usuário no servidor
        botoes.push({ id: "user_reset_strikes", name: client.tls.phrase(user, "menu.botoes.remover_strikes"), type: 1, emoji: client.emoji(42), data: `2|${id_alvo}` })

    if (warns.total > 0) // Botão para resetar os warns do usuário no servidor
        botoes.push({ id: "user_reset_warns", name: client.tls.phrase(user, "menu.botoes.remover_warns"), type: 1, emoji: client.emoji(42), data: `2|${id_alvo}` })

    if (botoes.length > 0)
        obj.components = [client.create_buttons(botoes, interaction)]

    client.reply(interaction, obj)
}