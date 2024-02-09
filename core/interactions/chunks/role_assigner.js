const { EmbedBuilder } = require('discord.js')

const { getRoleAssigner } = require('../../database/schemas/Role_assigner')

module.exports = async ({ client, user, interaction }) => {

    const embed = new EmbedBuilder()
        .setTitle("> Atribuindo cargos :passport_control:")
        .setColor(client.embed_color(user.misc.color))
        .setDescription("Este é um atribuidor de cargos, selecione os cargos que serão atribuídos de forma automática para os membros desse servidor, e se membros que possuem determinados cargos serão ignorados.")

    const cargos = await getRoleAssigner(interaction.guild.id)
    cargos.interaction = interaction.id
    await cargos.save()

    if (!cargos.atribute)
        embed.addFields(
            {
                name: `${client.emoji("mc_name_tag")} **Cargo selecionado**`,
                value: `\`Nenhum\``
            }
        )
    else
        embed.addFields(
            {
                name: `${client.emoji("mc_name_tag")} **Atribuir selecionados**`,
                value: listar_cargos(cargos.atribute)
            }
        )

    if (!cargos.ignore)
        embed.addFields(
            {
                name: `${client.emoji(4)} **Ignorar membros**`,
                value: `\`Ignorando nenhum\``
            }
        )
    else
        embed.addFields(
            {
                name: `${client.emoji(4)} **Ignorar membros**`,
                value: listar_cargos(cargos.ignore)
            }
        )

    const row = [
        { id: "role_assigner", name: "Cargos atribuídos", type: 1, emoji: client.emoji("mc_name_tag"), data: "2" },
        { id: "role_assigner", name: "Ignorar cargos", type: 1, emoji: client.emoji(4), data: "3" }
    ]

    if (cargos.atribute) // Só libera a função caso um cargo esteja selecionado
        row.push({ id: "role_assigner", name: "Iniciar atribuição", type: 2, emoji: client.emoji(10), data: "1" })

    client.reply(interaction, {
        embeds: [embed],
        components: [client.create_buttons(row, interaction)],
        ephemeral: true
    })
}

function listar_cargos(cargos) {

    const lista = []

    cargos.split(".").forEach(cargo => {

        if (cargo === "all")
            lista.push("`Que já possuírem algum cargo`")
        else
            lista.push(`<@&${cargo}>`)
    })

    return lista.join(", ")
}