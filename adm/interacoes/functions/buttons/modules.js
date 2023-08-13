const { getModule, dropModule } = require('../../../database/schemas/Module')
const { atualiza_modulos } = require('../../../automaticos/modulo')
const { EmbedBuilder } = require('discord.js')

module.exports = async ({ client, user, interaction, dados }) => {

    // Atribuindo badges a usuários
    const operacao = parseInt(dados.split(".")[1])
    const timestamp = parseInt(dados.split(".")[2])

    const modulo = await getModule(interaction.user.id, timestamp)

    // Códigos de operação
    // 0 -> Cancela
    // 1 -> Confirmar

    if (!operacao) {
        // Excluindo o módulo
        await dropModule(interaction.user.id, modulo.type, timestamp)

        client.tls.report(interaction, user, "menu.botoes.operacao_cancelada", true, 11, interaction.customId)
    } else {

        // Módulo do history
        if (modulo.type === 2 && modulo.data === null) {

            const embed = new EmbedBuilder()
                .setTitle(client.tls.phrase(user, "misc.modulo.definir_tipo"))
                .setColor(client.embed_color(user.misc.color))
                .setDescription(client.tls.phrase(user, "misc.modulo.descricao_tipo_history"))
                .setFooter({
                    text: client.tls.phrase(user, "misc.modulo.rodape_tipo_modulo"),
                    iconURL: interaction.user.avatarURL({ dynamic: true })
                })

            const row = client.create_buttons([
                { id: "history_button", name: client.tls.phrase(user, "menu.botoes.completo"), emoji: '📰', type: 2, data: `1|${timestamp}` },
                { id: "history_button", name: client.tls.phrase(user, "menu.botoes.resumido"), emoji: '🔖', type: 0, data: `2|${timestamp}` }
            ], interaction)

            return interaction.update({
                content: "",
                embeds: [embed],
                components: [row],
                ephemeral: client.decider(user?.conf.ghost_mode, 0)
            })
        }

        // Ativando o módulo
        modulo.stats.active = true
        await modulo.save()

        interaction.update({
            content: client.replace(client.tls.phrase(user, "misc.modulo.modulo_ativado", 6), [client.tls.phrase(user, `misc.modulo.ativacao_min_${modulo.stats.days}`), modulo.stats.hour]),
            embeds: [],
            components: [],
            ephemeral: true
        })
    }

    // Atualizando os módulos salvos localmente
    atualiza_modulos(client, 0, true)
}