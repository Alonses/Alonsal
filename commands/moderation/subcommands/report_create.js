const { getReport } = require('../../../core/database/schemas/User_reports')

module.exports = async ({ client, user, interaction }) => {

    let user_alvo = interaction.options.getUser("user")
    let id_alvo

    if (!user_alvo)
        return client.tls.reply(interaction, user, "mode.report.sem_usuario", true, client.emoji(0))

    if (typeof user_alvo === "object")
        id_alvo = user_alvo.id

    if (id_alvo === interaction.user.id) // Impede que o usuário se auto reporte
        return client.tls.reply(interaction, user, "mode.report.auto_reporte", true, client.emoji(0))

    if (id_alvo === client.id()) // Impede que o usuário reporte o bot
        return client.tls.reply(interaction, user, "mode.report.reportar_bot", true, client.emoji(0))

    if (isNaN(id_alvo) || id_alvo.length < 18) // ID inválido
        return client.tls.reply(interaction, user, "mode.report.id_invalido", true, client.defaultEmoji("types"))

    const membro_guild = await client.getMemberGuild(interaction, id_alvo)

    if (membro_guild?.user.bot) // Impede que outros bots sejam reportados
        return client.tls.reply(interaction, user, "mode.report.usuario_bot", true, client.emoji(0))

    const alvo = await getReport(client.encrypt(id_alvo), client.encrypt(interaction.guild.id))

    // Atribuindo o reporte ao usuário que disparou o comando
    alvo.issuer = client.encrypt(interaction.user.id)
    alvo.issuer_nick = client.encrypt(interaction.user.username)

    alvo.archived = false
    alvo.nick = client.encrypt(user_alvo.username)
    alvo.relatory = client.encrypt(interaction.options.getString("reason"))
    alvo.timestamp = client.timestamp()

    const guild = await client.getGuild(interaction.guild.id)
    let auto_ban = ""

    if (guild?.reports.auto_ban)
        auto_ban = `\n\n\`\`\`${client.tls.phrase(user, "mode.report.auto_ban_descricao", 34)}\`\`\``

    // Enviando o embed para validação
    const embed = client.create_embed({
        title: `${client.tls.phrase(user, "mode.report.reportado")} 🛂`,
        color: "salmao",
        description: `\`\`\`📃 | ${client.tls.phrase(user, "mode.warn.descricao_fornecida")}\n\n${interaction.options.getString("reason")}\`\`\`\n${client.tls.phrase(user, "mode.report.descricao_report")}${auto_ban}`,
        fields: [
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(user, "mode.report.usuario")}**`,
                value: `${client.emoji("icon_id")} \`${id_alvo}\`\n${client.emoji("mc_name_tag")} \`${user_alvo.username}\`\n( <@${id_alvo}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("guard")} **${client.tls.phrase(user, "mode.report.reportador")}**`,
                value: `${client.emoji("icon_id")} \`${interaction.user.id}\`\n${client.emoji("mc_name_tag")} \`${interaction.user.username}\`\n( <@${interaction.user.id}> )`,
                inline: true
            },
            {
                name: ":globe_with_meridians: **Server**",
                value: `${client.emoji("icon_id")} \`${interaction.guild.id}\`\n${client.defaultEmoji("earth")} \`${interaction.guild.name}\`\n<t:${alvo.timestamp}:R>`,
                inline: true
            }
        ],
        footer: {
            text: { tls: "menu.botoes.selecionar_operacao" },
            iconURL: client.avatar()
        }
    }, user)

    // Salvando o alvo para editar posteriormente
    await alvo.save()

    // Criando os botões para as funções de reporte
    // let botoes = [{ id: "report_user", name: { tls: "menu.botoes.confirmar_anunciando"), type: 2, emoji: '📣', data: `1|${alvo.uid}` }]
    let botoes = []

    if (guild.network.link) // Habilitando opção de enviar o aviso apenas aos servidores do network
        botoes.push({ id: "report_user", name: { tls: "menu.botoes.anunciar_ao_network", alvo: user }, type: 0, emoji: client.emoji(36), data: `3|${id_alvo}` })

    botoes.push(
        { id: "report_user", name: { tls: "menu.botoes.apenas_confirmar", alvo: user }, type: 1, emoji: '📫', data: `2|${id_alvo}` },
        { id: "report_user", name: { tls: "menu.botoes.cancelar", alvo: user }, type: 3, emoji: client.emoji(0), data: `0|${id_alvo}` }
    )

    return interaction.reply({
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        flags: "Ephemeral"
    })
}