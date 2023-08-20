const { EmbedBuilder } = require('discord.js')

const { getUserReports } = require('../../../adm/database/schemas/Report')

module.exports = async ({ client, user, interaction }) => {

    let id_alvo = interaction.options.getUser("user") || interaction.options.getString("id")

    if (!id_alvo) // Sem usuário informado
        return client.tls.reply(interaction, user, "mode.report.sem_usuario", true, client.emoji(0))

    if (typeof id_alvo === "object")
        id_alvo = id_alvo.id

    // Coletando os dados de histórico do usuário
    const reports = await getUserReports(id_alvo)
    const user_c = await client.getUser(id_alvo)
    const user_alvo = await client.getMemberGuild(interaction, id_alvo) // Dados de membro do servidor

    // Usuário não faz parte do servidor
    if (!user_alvo)
        return client.tls.reply(interaction, user, "mode.report.usuario_nao_encontrado", true, 1)

    let apelido = user_alvo.nickname !== null ? user_alvo.nickname : user_alvo.user.username
    let avisos = 0, descricao = `\`\`\`✅ | ${client.tls.phrase(user, "mode.report.sem_report")}\`\`\``

    let user_name = `\`${user_alvo.user.username.replace(/ /g, "")}#${user_alvo.user.discriminator}\`\n( ${user_alvo} )`

    if (user_alvo.user.discriminator == 0)
        user_name = `\`@${user_alvo.user.username.replace(/ /g, "")}\`\n( ${user_alvo} )`

    // Avatar do usuário
    const avatar_user = user_alvo.avatarURL({ dynamic: true, size: 2048 }), historico = []

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
        .setThumbnail(avatar_user)
        .setDescription(descricao)
        .addFields(
            {
                name: `**:bust_in_silhouette: ${client.tls.phrase(user, "mode.report.usuario")}**`,
                value: user_name,
                inline: true
            },
            {
                name: `**${client.emoji("icon_id")} ${client.tls.phrase(user, "mode.report.identificador")}**`,
                value: `\`${user_alvo.id}\``,
                inline: true
            },
            {
                name: `**:man_guard: ${client.tls.phrase(user, "mode.report.reporte")}: ${avisos}**`,
                value: "⠀",
                inline: true
            }
        )

    return interaction.reply({
        embeds: [infos_user],
        ephemeral: true
    })
}