const { checkUserGuildReported } = require("../../database/schemas/Report")

module.exports = async ({ client, user, interaction }) => {

    const reportes_guild = await checkUserGuildReported(interaction.guild.id)

    if (reportes_guild.length < 1)
        return interaction.reply({ content: ":mag: | Este servidor não possui nenhum reporte ativo!", ephemeral: true })

    const data = {
        alvo: "remove_report",
        values: reportes_guild
    }

    if (!interaction.customId)
        interaction.reply({
            content: "Escolha um usuário abaixo para poder gerenciar",
            embeds: [],
            components: [client.create_menus(client, interaction, user, data)],
            ephemeral: true
        })
    else
        interaction.update({
            content: "Escolha um usuário abaixo para poder gerenciar",
            embeds: [],
            components: [client.create_menus(client, interaction, user, data)],
            ephemeral: true
        })
}