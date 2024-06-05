const { getGuildWarn } = require('../../../database/schemas/Guild_warns')

module.exports = async ({ client, user, interaction, dados }) => {

    const tempo_mute = parseInt(dados.split(".")[0])
    const id_warn = parseInt(dados.split(".")[1])

    // Atualizando o tempo de expiração do cargo vinculado a advertência
    const warn = await getGuildWarn(interaction.guild.id, id_warn)
    warn.timed_role.timeout = tempo_mute

    await warn.save()

    // Redirecionando o evento
    dados = `x.y.${id_warn}`
    require('../../chunks/warn_configure')({ client, user, interaction, dados })
}