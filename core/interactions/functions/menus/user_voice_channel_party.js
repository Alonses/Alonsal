const { dropVoiceChannelParty, verifyPartyMember, verifyUserParty, registerPartyMember, dropPartyMember } = require("../../../database/schemas/User_voice_channel_party")

module.exports = async ({ client, user, interaction, dados }) => {

    const users = dados, partyLotada = []

    if (users.length < 1) { // Removendo todos os membros da party
        await dropVoiceChannelParty(user.uid, client.encrypt(interaction.guild.id))

        return require("../../chunks/panel_personal_voice_channels")({ client, user, interaction })
    } else {

        // Coletando todos os membros da party
        let party = (await verifyUserParty(user.uid, client.encrypt(interaction.guild.id))).length
        const partyMembers = {
            add: [],
            remove: []
        }

        // Adiciona ou remove membros da lista dos autorizados a acessarem o canal privado do usuário
        for (const u of users)
            if (u !== interaction.user.id && u !== client.id()) { // Ignorando o próprio autor e o bot
                if (!await verifyPartyMember(user.uid, client.encrypt(interaction.guild.id), client.encrypt(u))) partyMembers.add.push(u)
                else partyMembers.remove.push(u)
            }

        // Removendo os membros da party do servidor antes de adicionar para liberar espaço
        for (const u of partyMembers.remove) {
            await dropPartyMember(user.uid, client.encrypt(interaction.guild.id), client.encrypt(u))
            party--
        }

        // Adicionando os membros a party do servidor
        for (const u of partyMembers.add)
            if (party < client.cached.subscribers.has(user.uid) ? 30 : 10) {
                await registerPartyMember(user.uid, client.encrypt(interaction.guild.id), client.encrypt(u))
                party++
            } else partyLotada.push(`<@${u}>`)
    }

    return require("../../chunks/panel_personal_voice_channels")({ client, user, interaction, partyLotada })
}