const { dropVoiceChannelParty, verifyPartyMember } = require("../../../database/schemas/User_voice_channel_party")

module.exports = async ({ client, user, interaction, dados }) => {

    const users = dados

    if (users.length < 1) { // Removendo todos os membros da party
        await dropVoiceChannelParty(user.uid, client.encrypt(interaction.guild.id))

        return require("../../chunks/panel_personal_voice_channels")({ client, user, interaction })
    } else {

        // Adiciona ou remove membros da lista dos autorizados a acessarem o canal privado do usuário
        for (const u of users)
            if (u !== interaction.user.id && u !== client.id()) // Ignorando o próprio autor e o bot
                await verifyPartyMember(user.uid, client.encrypt(interaction.guild.id), client.encrypt(u))
    }

    return require("../../chunks/panel_personal_voice_channels")({ client, user, interaction })
}