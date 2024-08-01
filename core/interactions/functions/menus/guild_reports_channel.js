module.exports = async ({ client, user, interaction, dados }) => {
    const { reports_id } = await client.getGuild(interaction.guild.id)
    await client.prisma.guildOptionsReports.update({
        where: { id: reports_id },
        data: { channel: dados }
    })

    const pagina_guia = 2 // Redirecionando o evento
    require('../../chunks/panel_guild_external_reports')({ client, user, interaction, pagina_guia })
}