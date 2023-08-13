const { getReport, dropReport } = require('../../../database/schemas/Report')

module.exports = async ({ client, user, interaction, dados }) => {

    // Gerenciamento de anotações
    const operacao = parseInt(dados.split(".")[1])
    const id_alvo = dados.split(".")[2]

    const alvo = await getReport(id_alvo, interaction.guild.id)

    // Códigos de operação
    // 0 -> Cancela
    // 1 -> Confirma e notifica
    // 2 -> Confirma silenciosamente

    if (!operacao) {
        // Removendo o usuário da lista de reportados

        await dropReport(alvo.uid, interaction.guild.id)
        return client.tls.report(interaction, user, "menu.botoes.operacao_cancelada", true, 11, interaction.customId)
    }

    // Reportando um usuário mau comportado
    if (operacao === 1) {
        // Adicionando e reportando para outros servidores

        alvo.archived = false
        await alvo.save()

        interaction.update({
            content: client.tls.phrase(user, "mode.report.usuario_add", client.defaultEmoji("guard")),
            embeds: [],
            components: [],
            ephemeral: true
        })
        require('../../../automaticos/dispara_reporte')({ client, alvo })
    }

    if (operacao === 2) {
        // Adicionando sem anunciar para outros servidores

        alvo.archived = false
        await alvo.save()

        interaction.update({
            content: client.tls.phrase(user, "mode.report.adicionado_silenciosamente", client.defaultEmoji("guard")),
            embeds: [],
            components: [],
            ephemeral: true
        })
    }
}