const { getModule, getModulesPrice } = require('../../database/schemas/Module')

const formata_horas = require('../../formatters/formata_horas')

module.exports = async ({ client, user, interaction, dados }) => {

    // Exibindo os dados de alguma tarefa selecionada
    const modulo = await getModule(dados.split(".")[1])

    if (!modulo)
        return interaction.update({
            content: client.tls.phrase(user, "misc.modulo.modulo_inexistente", 1),
            embeds: [],
            components: [],
            flags: "Ephemeral"
        })

    const montante = await getModulesPrice(client, user.uid)
    const ativacao_modulo = `${client.tls.phrase(user, `misc.modulo.ativacao_${modulo.stats.days}`)} ${formata_horas(modulo.stats.hour.split(":")[0], modulo.stats.hour.split(":")[1])}`
    let modulo_vitrine = ""

    // Módulo de servidor sem configuração de canal para anúncio
    if (modulo.misc.scope === "guild" && !modulo.misc.cid) {

        dados = `12.${interaction.user.id}.${modulo.hash}`
        return require("../functions/buttons/module_button")({ client, user, interaction, dados })
    }

    if (modulo.rotative.active) // Informações sobre módulos vitrine
        modulo_vitrine = client.tls.phrase(user, "misc.modulo.modulo_vitrine")

    const embed = client.create_embed({
        title: { tls: modulo.misc.scope === "user" ? "misc.modulo.visualizar_modulo" : "misc.modulo.visualizar_modulo_servidor" },
        description: { tls: "misc.modulo.descricao", replace: [client.cached.subscribers.has(user.uid) ? client.locale(modulo.stats.price * client.cached.subscriber_discount) : modulo.stats.price, montante, modulo_vitrine] },
        fields: [
            {
                name: `${client.defaultEmoji("types")} **${client.tls.phrase(user, "misc.modulo.tipo")}**`,
                value: `\`${client.tls.phrase(user, `misc.modulo.modulo_${modulo.type}`)}\`${modulo.type === 0 ? `\n🏙 Local: \`${client.decifer(modulo.misc.locale)}\`` : ""}`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("time")} **${client.tls.phrase(user, "misc.modulo.ativacao")}**`,
                value: `\`${ativacao_modulo}\``,
                inline: true
            },
            {
                name: `${client.defaultEmoji("money")} **${client.tls.phrase(user, "misc.modulo.valor")}**`,
                value: `\`B$ ${client.cached.subscribers.has(user.uid) ? `${client.locale(modulo.stats.price * client.cached.subscriber_discount)} (${client.getSubscriberDiscount()}% OFF 🌟)` : modulo.stats.price}\``,
                inline: true
            }
        ],
        footer: {
            text: { tls: "menu.botoes.selecionar_operacao" },
            iconURL: interaction.user.avatarURL({ dynamic: true })
        }
    }, user)

    if (modulo.misc.scope === "guild")
        embed.addFields(
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "mode.canal.canal")}:**`,
                value: `${client.emoji("icon_id")} \`${client.decifer(modulo.misc.cid)}\`\n( <#${client.decifer(modulo.misc.cid)}> )`,
                inline: true
            }
        )

    // Criando os botões para as funções de gestão de tarefas
    let botoes = [
        { id: "module_button", name: { tls: "menu.botoes.alterar_frequencia" }, emoji: client.defaultEmoji("calendar"), type: 1, data: `3|${modulo.hash}` },
        { id: "module_button", name: { tls: `menu.botoes.${modulo.stats.active ? "desativar" : "ativar"}` }, emoji: client.emoji(modulo.stats.active ? 21 : 20), type: client.execute("functions", "emoji_button.type_button", modulo.stats.active), data: `1|${modulo.hash}` },
        { id: "module_button", name: { tls: "menu.botoes.vitrine" }, type: client.execute("functions", "emoji_button.type_button", modulo.rotative.active), emoji: client.emoji(6), data: `10|${modulo.hash}`, disabled: !client.cached.subscribers.has(user.uid) },
        { id: "module_button", name: { tls: "menu.botoes.apagar" }, type: 3, emoji: client.emoji(13), data: `0|${modulo.hash}` }
    ]

    const row = [{ id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 0, emoji: client.emoji(19), data: "modulos" }]

    if (modulo.misc.scope === "guild")
        row.push({ id: "module_button", name: { tls: "menu.botoes.escolher_canal" }, type: 1, emoji: client.defaultEmoji('channel'), data: `12|${modulo.hash}` })

    if (modulo.type === 2) // Módulo do History sem tipo de retorno definido
        row.push({ id: "module_config", name: { tls: "menu.botoes.definir_retorno" }, type: 1, emoji: client.defaultEmoji('paper'), data: `1|${modulo.hash}` })

    if (modulo.type === 0) // Módulo de tempo com retorno reduzido
        row.push({ id: "module_button", name: { tls: "menu.botoes.modo_resumido" }, type: client.execute("functions", "emoji_button.type_button", modulo.misc.resumed), emoji: client.emoji(48), data: `11|${modulo.hash}` })

    interaction.update({
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction, user), client.create_buttons(row, interaction, user)],
        flags: client.decider(user?.conf.ghost_mode, 0) ? "Ephemeral" : null
    })
}