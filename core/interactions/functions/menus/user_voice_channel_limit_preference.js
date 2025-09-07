module.exports = async ({ client, user, interaction, dados }) => {

    const novo_limite = parseInt(dados.split(".")[0])

    // Atualizando as preferências de limite de membros para os canais dinâmicos do usuário
    user.misc.voice_channels.user_limit = novo_limite
    await user.save()

    require("../../chunks/panel_personal_voice_channels")({ client, user, interaction })
}