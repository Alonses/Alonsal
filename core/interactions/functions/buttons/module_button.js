const { atualiza_modulos } = require('../../../auto/module')
const { getModule, dropModule } = require('../../../database/schemas/Module')

module.exports = async ({ client, user, interaction, dados }) => {

    // Gerenciamento de anotações
    const operacao = parseInt(dados.split(".")[1])
    const timestamp = parseInt(dados.split(".")[2])

    // Códigos de operação
    // 0 -> Apagar
    // 1 -> Ligar módulo
    // 2 -> Desligar módulo

    let row = client.create_buttons([
        { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: `modulos` }
    ], interaction)

    if (operacao === 1) {

        // Ativando o módulo
        const modulo = await getModule(interaction.user.id, timestamp)

        // Impedindo que o módulo de clima seja ativado caso não haja um local padrão
        if (modulo.type === 0 && !user.misc.locale)
            return interaction.update({ content: ":octagonal_sign: | Você precisa definir um local padrão com o comando </link locale:1020561785620803674> para poder ativar este módulo", ephemeral: true })

        modulo.stats.active = true

        await modulo.save()

        return interaction.update({
            content: client.tls.phrase(user, "misc.modulo.ativado", 20),
            embeds: [],
            components: [row],
            ephemeral: client.decider(user?.conf.ghost_mode, 0)
        })
    }

    if (operacao === 2) {

        // Desativando o módulo
        const modulo = await getModule(interaction.user.id, timestamp)
        modulo.stats.active = false

        await modulo.save()

        return interaction.update({
            content: client.tls.phrase(user, "misc.modulo.desativado", 21),
            embeds: [],
            components: [row],
            ephemeral: client.decider(user?.conf.ghost_mode, 0)
        })
    }

    if (operacao === 0) {

        // Excluindo o módulo
        const modulo = await getModule(interaction.user.id, timestamp)

        await dropModule(interaction.user.id, modulo.type, timestamp)

        return interaction.update({
            content: client.tls.phrase(user, "misc.modulo.excluido", 13),
            embeds: [],
            components: [row],
            ephemeral: client.decider(user?.conf.ghost_mode, 0)
        })
    }

    atualiza_modulos(client, 0, true)
}