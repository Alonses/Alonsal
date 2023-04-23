const { getModule, dropModule } = require('../../../database/schemas/Module')
const { atualiza_modulos } = require('../../../automaticos/modulo')

module.exports = async ({ client, user, interaction, dados }) => {

    // Atribuindo badges a usuários
    const operacao = parseInt(dados.split(".")[1])
    const type = parseInt(dados.split(".")[2])

    // Códigos de operação
    // 0 -> Cancela
    // 1 -> Confirmar

    if (!operacao) {
        await dropModule(interaction.user.id, parseInt(type))

        client.tls.report(interaction, user, "menu.botoes.operacao_cancelada", true, 11, interaction.customId)
    } else {

        const modulo = await getModule(interaction.user.id, parseInt(type))
        const ativacoes = [client.tls.phrase(user, "misc.modulo.dias_uteis_2"), client.tls.phrase(user, "misc.modulo.finais_semana_2"), client.tls.phrase(user, "misc.modulo.todos_os_dias_2")]

        // Ativando o módulo
        modulo.stats.active = true
        await modulo.save()

        interaction.update({ content: client.replace(client.tls.phrase(user, "misc.modulo.modulo_ativado", 6), [ativacoes[modulo.stats.days], modulo.stats.hour]), embeds: [], components: [], ephemeral: true })
    }

    // Atualizando os módulos salvos localmente
    atualiza_modulos(client, 0, true)
}