const { getModule, getModulesPrice } = require('../../database/schemas/User_modules')

const formata_horas = require('../../formatters/formata_horas')

module.exports = async ({ client, user, interaction, dados }) => {

    // Exibindo os dados de alguma tarefa selecionada
    const timestamp = parseInt(dados.split(".")[1])
    const modulo = await getModule(user.uid, timestamp)

    if (!modulo)
        return interaction.update({
            content: client.tls.phrase(user, "misc.modulo.modulo_inexistente", 1),
            embeds: [],
            components: [],
            flags: "Ephemeral"
        })

    const montante = await getModulesPrice(user.uid)
    const ativacao_modulo = `${client.tls.phrase(user, `misc.modulo.ativacao_${modulo.stats.days}`)} ${formata_horas(modulo.stats.hour.split(":")[0], modulo.stats.hour.split(":")[1])}`

    const embed = client.create_embed({
        title: { tls: "misc.modulo.visualizar_modulo" },
        description: { tls: "misc.modulo.descricao", replace: [modulo.stats.price, montante] },
        fields: [
            {
                name: `${client.defaultEmoji("types")} **${client.tls.phrase(user, "misc.modulo.tipo")}**`,
                value: `\`${client.tls.phrase(user, `misc.modulo.modulo_${modulo.type}`)}\``,
                inline: true
            },
            {
                name: `${client.defaultEmoji("time")} **${client.tls.phrase(user, "misc.modulo.ativacao")}**`,
                value: `\`${ativacao_modulo}\``,
                inline: true
            },
            {
                name: `${client.defaultEmoji("money")} **${client.tls.phrase(user, "misc.modulo.valor")}**`,
                value: `\`B$ ${modulo.stats.price}\``,
                inline: true
            }
        ],
        footer: {
            text: { tls: "menu.botoes.selecionar_operacao" },
            iconURL: interaction.user.avatarURL({ dynamic: true })
        }
    }, user)

    // Criando os botões para as funções de gestão de tarefas
    let botoes = [
        { id: "return_button", name: { tls: "menu.botoes.retornar", alvo: user }, type: 0, emoji: client.emoji(19), data: "modulos" },
        { id: "module_button", name: { tls: "menu.botoes.alterar_frequencia", alvo: user }, emoji: client.defaultEmoji("calendar"), type: 1, data: `3|${modulo.stats.timestamp}` }
    ]

    if (modulo.stats.active) // Módulo ativado
        botoes.push({ id: "module_button", name: { tls: "menu.botoes.desativar", alvo: user }, emoji: client.emoji(21), type: 1, data: `2|${modulo.stats.timestamp}` })
    else // Módulo desativado
        botoes.push({ id: "module_button", name: { tls: "menu.botoes.ativar", alvo: user }, type: 2, emoji: client.emoji(20), data: `1|${modulo.stats.timestamp}` })

    botoes.push({ id: "module_button", name: { tls: "menu.botoes.apagar", alvo: user }, type: 3, emoji: client.emoji(13), data: `0|${modulo.stats.timestamp}` })

    if (modulo.type === 2 && modulo.data === null) // Módulo do History sem tipo de retorno definido
        botoes.push({ id: "module", name: { tls: "menu.botoes.definir_retorno", alvo: user }, type: 2, emoji: client.defaultEmoji('paper'), data: `1|${modulo.stats.timestamp}` })

    interaction.update({
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        flags: client.decider(user?.conf.ghost_mode, 0) ? "Ephemeral" : null
    })
}