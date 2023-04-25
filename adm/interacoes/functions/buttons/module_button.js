const { atualiza_modulos } = require('../../../automaticos/modulo')
const { getModule, dropModule } = require('../../../database/schemas/Module')

module.exports = async ({ client, user, interaction, dados }) => {

    // Gerenciamento de anotações
    const operacao = parseInt(dados.split(".")[1])
    const timestamp = parseInt(dados.split(".")[2])

    // Códigos de operação
    // 0 -> Apagar
    // 1 -> Ligar módulo
    // 2 -> Desligar módulo

    if (operacao === 1) {

        // Ativando o módulo
        const modulo = await getModule(interaction.user.id, timestamp)
        modulo.stats.active = true

        await modulo.save()

        return interaction.update({ content: 'Seu módulo foi ativo novamente!', components: [], embeds: [], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
    }

    if (operacao === 2) {

        // Desativando o módulo
        const modulo = await getModule(interaction.user.id, timestamp)
        modulo.stats.active = false

        await modulo.save()

        return interaction.update({ content: 'Seu módulo foi desativado!', components: [], embeds: [], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
    }

    if (operacao === 0) {

        // Excluindo o módulo
        const modulo = await getModule(interaction.user.id, timestamp)

        await dropModule(interaction.user.id, modulo.type, timestamp)

        return interaction.update({ content: 'Seu módulo foi apagado', embeds: [], components: [], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
    }

    atualiza_modulos(client, 0, true)
}