const { EmbedBuilder } = require('discord.js')

const { getModule, getModulesPrice } = require('../../../database/schemas/Module')

const formata_horas = require('../../../formatadores/formata_horas')

module.exports = async ({ client, user, interaction, dados }) => {

    // Exibindo os dados de alguma tarefa selecionada
    const timestamp = parseInt(dados.split(".")[1])
    const modulo = await getModule(interaction.user.id, timestamp)

    const tipos_modulo = ["🌩️ Clima", "🖊️ Frases", "🏯 Eventos históricos", "🃏 Charadas"], ativacoes = [client.tls.phrase(user, "misc.modulo.dias_uteis"), client.tls.phrase(user, "misc.modulo.finais_semana"), client.tls.phrase(user, "misc.modulo.todos_os_dias")]

    const ativacao_modulo = `${ativacoes[modulo.stats.days]} às ${formata_horas(modulo.stats.hour.split(":")[0], modulo.stats.hour.split(":")[1])}`
    const montante = await getModulesPrice(interaction.user.id)

    const embed = new EmbedBuilder()
        .setTitle("> Seu módulo")
        .setColor(client.embed_color(user.misc.color))
        .addFields(
            {
                name: `**${client.defaultEmoji("types")} ${client.tls.phrase(user, "misc.modulo.tipo")}**`,
                value: `\`${tipos_modulo[modulo.type]}\``,
                inline: true
            },
            {
                name: `**${client.defaultEmoji("time")} ${client.tls.phrase(user, "misc.modulo.ativacao")}**`,
                value: `\`${ativacao_modulo}\``,
                inline: true
            },
            {
                name: `**${client.defaultEmoji("money")} ${client.tls.phrase(user, "misc.modulo.valor")}**`,
                value: `\`B$ ${modulo.stats.price}\``,
                inline: true
            }
        )
        .setDescription(client.replace(client.tls.phrase(user, "misc.modulo.descricao"), [modulo.stats.price, montante]))
        .setFooter({ text: client.tls.phrase(user, "menu.botoes.selecionar_operacao"), iconURL: interaction.user.avatarURL({ dynamic: true }) })

    // Criando os botões para as funções de gestão de tarefas
    let row

    if (modulo.stats.active) // Módulo ativado
        row = client.create_buttons([{ id: "module_button", name: 'Desativar', value: '0', type: 1, data: `2|${modulo.stats.timestamp}` }, { id: "module_button", name: client.tls.phrase(user, "menu.botoes.apagar"), value: '0', type: 3, emoji: client.emoji(13), data: `0|${modulo.stats.timestamp}` }, { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), value: '1', type: 0, emoji: client.emoji(19), data: `modulos` }], interaction)
    else // Módulo desativado
        row = client.create_buttons([{ id: "module_button", name: 'Ativar', value: '1', type: 2, data: `1|${modulo.stats.timestamp}` }, { id: "module_button", name: client.tls.phrase(user, "menu.botoes.apagar"), value: '0', type: 3, emoji: client.emoji(13), data: `0|${modulo.stats.timestamp}` }, { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), value: '1', type: 0, emoji: client.emoji(19), data: `modulos` }], interaction)

    return interaction.update({ content: "", embeds: [embed], components: [row], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
}