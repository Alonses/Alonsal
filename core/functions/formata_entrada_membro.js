module.exports = ({ client, data }) => {

    // Separando dados
    const guild = data.guild
    const user_guild = data.member
    const embed = data.embed

    if (user_guild.joinedTimestamp) // Verifica se há dados de entrada no servidor para o membro
        embed.addFields(
            {
                name: `${client.defaultEmoji("calendar")} **${client.tls.phrase(guild, "util.user.entrada")}**`,
                value: `<t:${parseInt(user_guild.joinedTimestamp / 1000)}:F>\n( <t:${Math.floor(user_guild.joinedTimestamp / 1000)}:R> )`,
                inline: false
            }
        )

    return embed
}