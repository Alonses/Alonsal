const { getUserWarn } = require("../../database/schemas/User_warns")

module.exports = async ({ client, user, interaction, dados }) => {

    const id_alvo = dados.split(".")[0]
    const timestamp = dados.split(".")[1]
    const pagina = dados.split(".")[2]

    let alvo = await getUserWarn(id_alvo, interaction.guild.id, timestamp)

    const embed = client.create_embed({
        title: { tls: "mode.warn.remover_advertencia" },
        color: "salmao",
        description: { tls: "mode.report.remover_reporte_desc", replace: alvo.relatory },
        fields: [
            {
                name: `:bust_in_silhouette: **${client.tls.phrase(user, "mode.report.usuario")}**`,
                value: `${client.emoji("icon_id")} \`${alvo.uid}\`\n( <@${alvo.uid}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("guard")} **${client.tls.phrase(user, "mode.report.reportador")}**`,
                value: `${client.emoji("icon_id")} \`${alvo.assigner}\`\n( <@${alvo.assigner}> )`,
                inline: true
            },
            { name: "⠀", value: "⠀", inline: true }
        ],
        footer: {
            text: { tls: "menu.botoes.selecionar_operacao" },
            iconURL: client.avatar()
        }
    }, user)

    // Criando os botões para as funções de advertências
    const row = client.create_buttons([
        { id: "return_button", name: { tls: "menu.botoes.retornar", alvo: user }, type: 0, emoji: client.emoji(19), data: `remove_warn|${pagina}` },
        { id: "warn_remove_user", name: { tls: "menu.botoes.confirmar", alvo: user }, type: 2, emoji: client.emoji(10), data: `1|${id_alvo}.${id_guild}` },
        { id: "warn_remove_user", name: { tls: "menu.botoes.cancelar", alvo: user }, type: 3, emoji: client.emoji(0), data: `0|${id_alvo}.${id_guild}` }
    ], interaction)

    client.reply(interaction, {
        embeds: [embed],
        components: [row],
        flags: "Ephemeral"
    })
}