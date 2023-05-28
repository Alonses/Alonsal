const { EmbedBuilder } = require('discord.js')

const { getUserReports } = require('../../../adm/database/schemas/Report')

module.exports = async ({ client, user, interaction }) => {

    let id_alvo = interaction.options.getUser("user") || interaction.options.getString("id")

    if (!id_alvo) // Sem usuário informado
        return client.tls.reply(interaction, user, "mode.report.sem_usuario", true, 0)

    if (typeof id_alvo === "object")
        id_alvo = id_alvo.id

    // Coletando os dados de histórico do usuário
    const reports = await getUserReports(id_alvo)
    const user_c = await client.getUser(id_alvo)
    let user_alvo = await client.getUserGuild(interaction, id_alvo) // Dados de membro do servidor

    // Usuário não faz parte do servidor
    if (!user_alvo)
        return client.tls.reply(interaction, user, "mode.report.usuario_nao_encontrado", true, 1)

    let apelido = user_alvo.nickname !== null ? user_alvo.nickname : user_alvo.user.username

    // Avatar do usuário
    let avatar_user = `https://cdn.discordapp.com/avatars/${user_alvo.id}/${user_alvo.user.avatar}.gif?size=1024`

    if (avatar_user !== null) {
        avatar_user = avatar_user.replace(".webp", ".gif")

        await fetch(avatar_user)
            .then(res => {
                if (res.status !== 200)
                    avatar_user = avatar_user.replace('.gif', '.webp')
            })
    } else
        avatar_user = ""

    let avisos = 0, descricao = `\`\`\`✅ | ${client.tls.phrase(user, "mode.report.sem_report")}\`\`\``
    const historico = []

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
        .addFields(
            {
                name: ":globe_with_meridians: **Discord**",
                value: `\`${user_alvo.user.username.replace(/ /g, "")}#${user_alvo.user.discriminator}\``,
                inline: true
            },
            {
                name: ":label: **Discord ID**",
                value: `\`${user_alvo.id}\``,
                inline: true
            },
            {
                name: `**:man_guard: ${client.tls.phrase(user, "mode.report.reporte")}: ${avisos}**`,
                value: "⠀",
                inline: true
            }
        )
        .setDescription(descricao)

    return interaction.reply({ embeds: [infos_user], ephemeral: true })
}