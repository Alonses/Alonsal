const { EmbedBuilder } = require('discord.js')

const { getModule, getModulesPrice } = require('../../database/schemas/Module')

const formata_horas = require('../../formatters/formata_horas')

module.exports = async ({ client, user, interaction, dados }) => {

    // Exibindo os dados de alguma tarefa selecionada
    const timestamp = parseInt(dados.split(".")[1])
    const modulo = await getModule(interaction.user.id, timestamp)

    if (!modulo)
        return interaction.update({
            content: client.tls.phrase(user, "misc.modulo.modulo_inexistente", 1),
            embeds: [],
            components: [],
            ephemeral: true
        })

    const montante = await getModulesPrice(interaction.user.id)
    const ativacao_modulo = `${client.tls.phrase(user, `misc.modulo.ativacao_${modulo.stats.days}`)} ${formata_horas(modulo.stats.hour.split(":")[0], modulo.stats.hour.split(":")[1])}`

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(user, "misc.modulo.visualizar_modulo"))
        .setColor(client.embed_color(user.misc.color))
        .setDescription(client.tls.phrase(user, "misc.modulo.descricao", null, [modulo.stats.price, montante]))
        .addFields(
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
        )
        .setFooter({
            text: client.tls.phrase(user, "menu.botoes.selecionar_operacao"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    // Criando os botões para as funções de gestão de tarefas
    let botoes = [
        { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "modulos" },
        { id: "module_button", name: client.tls.phrase(user, "menu.botoes.alterar_dia"), emoji: client.defaultEmoji("calendar"), type: 1, data: `3|${modulo.stats.timestamp}` }
    ]

    if (modulo.stats.active) // Módulo ativado
        botoes = botoes.concat([{ id: "module_button", name: client.tls.phrase(user, "menu.botoes.desativar"), emoji: client.emoji(21), type: 1, data: `2|${modulo.stats.timestamp}` }])
    else // Módulo desativado
        botoes = botoes.concat([{ id: "module_button", name: client.tls.phrase(user, "menu.botoes.ativar"), type: 2, emoji: client.emoji(20), data: `1|${modulo.stats.timestamp}` }])

    botoes = botoes.concat([{ id: "module_button", name: client.tls.phrase(user, "menu.botoes.apagar"), type: 3, emoji: client.emoji(13), data: `0|${modulo.stats.timestamp}` }])

    if (modulo.type === 2 && modulo.data === null) // Módulo do History sem tipo de retorno definido
        botoes = botoes.concat([{ id: "module", name: client.tls.phrase(user, "menu.botoes.definir_retorno"), type: 2, emoji: client.defaultEmoji('paper'), data: `1|${modulo.stats.timestamp}` }])

    interaction.update({
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: client.decider(user?.conf.ghost_mode, 0)
    })
}