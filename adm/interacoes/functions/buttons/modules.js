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

        interaction.update({ content: ":o: | Operação cancelada!", embeds: [], components: [], ephemeral: true })
    } else {

        const modulo = await getModule(interaction.user.id, parseInt(type))
        const ativacoes = ["nos dias úteis", "nos finais de semana", "todos os dias"]

        // Ativando o módulo
        modulo.stats.active = true

        await modulo.save()

        interaction.update({ content: `:mega: | Módulo ativado! Seu módulo será enviado ${ativacoes[modulo.stats.days]} às \`${modulo.stats.hour}\``, embeds: [], components: [], ephemeral: true })
    }

    // Atualizando os módulos salvos localmente
    atualiza_modulos(client, 0, true)
}