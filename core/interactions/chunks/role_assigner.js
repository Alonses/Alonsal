const { EmbedBuilder } = require('discord.js')

const { getRoleAssigner } = require('../../database/schemas/Guild_role_assigner')

module.exports = async ({ client, user, interaction }) => {

    const embed = new EmbedBuilder()
        .setTitle(`${client.tls.phrase(user, "mode.roles.titulo_atribuidor")} :passport_control:`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription(client.tls.phrase(user, "mode.roles.descricao_atribuidor"))

    const cargos = await getRoleAssigner(interaction.guild.id)
    cargos.interaction = interaction.id
    await cargos.save()

    if (!cargos.atribute)
        embed.addFields(
            {
                name: `${client.emoji("mc_name_tag")} **${client.tls.phrase(user, "mode.roles.cargo_selecionado")}**`,
                value: `\`${client.tls.phrase(user, "mode.roles.nenhum")}\``
            }
        )
    else
        embed.addFields(
            {
                name: `${client.emoji("mc_name_tag")} **${client.tls.phrase(user, "mode.roles.atribuir_selecionados")}**`,
                value: listar_cargos(client, user, cargos.atribute)
            }
        )

    if (!cargos.ignore)
        embed.addFields(
            {
                name: `${client.emoji(4)} **${client.tls.phrase(user, "mode.roles.ignorar_membros")}**`,
                value: `\`${client.tls.phrase(user, "mode.roles.ignorando_nenhum")}\``
            }
        )
    else
        embed.addFields(
            {
                name: `${client.emoji(4)} **${client.tls.phrase(user, "mode.roles.ignorar_membros")}**`,
                value: listar_cargos(client, user, cargos.ignore)
            }
        )

    const row = [
        { id: "role_assigner", name: client.tls.phrase(user, "menu.botoes.cargos_atribuidos"), type: 1, emoji: client.emoji("mc_name_tag"), data: "2" },
        { id: "role_assigner", name: client.tls.phrase(user, "menu.botoes.ignorar_cargos"), type: 1, emoji: client.emoji(4), data: "3" }
    ]

    if (cargos.atribute) // Só libera a função caso um cargo esteja selecionado
        row.push({ id: "role_assigner", name: client.tls.phrase(user, "menu.botoes.iniciar_atribuicao"), type: 2, emoji: client.emoji(10), data: "1" })

    client.reply(interaction, {
        embeds: [embed],
        components: [client.create_buttons(row, interaction)],
        ephemeral: true
    })
}

function listar_cargos(client, user, cargos) {

    const lista = []

    cargos.split(".").forEach(cargo => {
        if (cargo === "all") lista.push(client.tls.phrase(user, "mode.roles.ignorar_membros_com_cargos"))
        else lista.push(`<@&${cargo}>`)
    })

    return lista.join(", ")
}