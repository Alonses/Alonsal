const { getGuildWarn } = require('../../../database/schemas/Warns_guild')

module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    const tempo_mute = parseInt(dados.split(".")[0])
    const id_warn = parseInt(dados.split(".")[1])

    // Atualizando o tempo de mute da advertência
    const warn = await getGuildWarn(interaction.guild.id, id_warn)
    warn.timeout = tempo_mute
    await warn.save()

    // Redirecionando o evento
    dados = `x.y.${id_warn}`
    require('../../chunks/warn_configure')({ client, user, interaction, dados })
}