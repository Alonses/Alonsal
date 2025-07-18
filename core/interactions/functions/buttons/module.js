const { EmbedBuilder } = require('discord.js')

const { getModule, dropModule } = require('../../../database/schemas/User_modules')
const { atualiza_modulos } = require('../../../auto/triggers/user_modules')

module.exports = async ({ client, user, interaction, dados }) => {

    const operacao = parseInt(dados.split(".")[1])
    const timestamp = parseInt(dados.split(".")[2])

    const modulo = await getModule(user.uid, timestamp)

    if (!modulo)
        return interaction.update({
            content: client.tls.phrase(user, "misc.modulo.modulo_inexistente", 1),
            embeds: [],
            components: [],
            flags: "Ephemeral"
        })

    // Códigos de operação
    // 0 -> Cancela
    // 1 -> Confirmar

    if (!operacao) { // Excluindo o módulo salvo em cache
        await dropModule(user.uid, modulo.type, timestamp)

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
                { id: "module_history_button", name: client.tls.phrase(user, "menu.botoes.completo"), emoji: '📰', type: 2, data: `1|${timestamp}` },
                { id: "module_history_button", name: client.tls.phrase(user, "menu.botoes.resumido"), emoji: '🔖', type: 0, data: `2|${timestamp}` }
            ], interaction)

            return interaction.update({
                content: "",
                embeds: [embed],
                components: [row],
                flags: client.decider(user?.conf.ghost_mode, 0) ? "Ephemeral" : null
            })
        }

        // Ativando o módulo
        modulo.stats.active = true
        await modulo.save()

        // Botão de atalho para navegar pelos módulos criados
        let row = client.create_buttons([
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.ver_modulos"), type: 1, emoji: client.defaultEmoji("paper"), data: "modulos" }
        ], interaction)

        interaction.update({
            content: client.tls.phrase(user, "misc.modulo.modulo_ativado", 6, [client.tls.phrase(user, `misc.modulo.ativacao_min_${modulo.stats.days}`), modulo.stats.hour]),
            embeds: [],
            components: [row],
            flags: "Ephemeral"
        })
    }

    atualiza_modulos(client) // Atualizando a lista de módulos salvos localmente
}