module.exports = async ({ client, user, interaction, alvo }) => {

    // Retirando o reporte do usuário e anexando uma justificativa
    alvo.archived = true
    alvo.relatory = `${alvo.relatory}\n🔰 | ${interaction.options.getString("reason")}`

    client.tls.reply(interaction, user, "mode.report.usuario_att", true, 7)

    await alvo.save()
}