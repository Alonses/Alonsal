const { getModule, dropModule } = require('../../../database/schemas/Module')
const { atualiza_modulos } = require('../../../auto/triggers/modules')

module.exports = async ({ client, user, interaction, dados }) => {

    const operacao = parseInt(dados.split(".")[1])
    const hash = dados.split(".")[2]

    const modulo = await getModule(hash)

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
        await dropModule(hash)

        client.tls.report(interaction, user, "menu.botoes.operacao_cancelada", true, 11, interaction.customId)
    } else {

        // Módulo do history
        if (modulo.type === 2 && modulo.data === null) {

            const embed = client.create_embed({
                title: { tls: "misc.modulo.definir_tipo" },
                description: { tls: "misc.modulo.descricao_tipo_history" },
                footer: {
                    text: client.tls.phrase(user, "misc.modulo.rodape_tipo_modulo"),
                    iconURL: interaction.user.avatarURL({ dynamic: true })
                }
            }, user)

            const row = client.create_buttons([
                { id: "module_history_button", name: { tls: "menu.botoes.completo" }, emoji: '📰', type: 1, data: `1|${hash}` },
                { id: "module_history_button", name: { tls: "menu.botoes.resumido" }, emoji: '🔖', type: 2, data: `2|${hash}` }
            ], interaction, user)

            return interaction.update({
                content: "",
                embeds: [embed],
                components: [row],
                flags: client.decider(user?.conf.ghost_mode, 0) ? "Ephemeral" : null
            })
        }

        // Redirecionando para configuração do canal para envio dos módulos em servidores
        if (modulo.misc.scope === "guild") {
            dados = `${interaction.user.id}.12.${hash}`
            return require('./module_button')({ client, user, interaction, dados })
        }

        // Ativando o módulo
        modulo.stats.active = true
        await modulo.save()

        // Botão de atalho para navegar pelos módulos criados
        let row = client.create_buttons([
            { id: "return_button", name: { tls: "menu.botoes.ver_modulos" }, type: 1, emoji: client.defaultEmoji("paper"), data: "modulos" }
        ], interaction, user)

        interaction.update({
            content: client.tls.phrase(user, "misc.modulo.modulo_ativado", 6, [client.tls.phrase(user, `misc.modulo.ativacao_min_${modulo.stats.days}`), modulo.stats.hour]),
            embeds: [],
            components: [row],
            flags: "Ephemeral"
        })
    }

    atualiza_modulos(client) // Atualizando a lista de módulos salvos localmente
}