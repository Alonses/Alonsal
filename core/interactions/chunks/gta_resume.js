const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

module.exports = async ({ client, user, interaction }) => {

    fetch(`${process.env.url_apisal}/gta?idioma=${user.lang}`)
        .then(response => response.json())
        .then(async data => {

            let emoji_horario = data.gameTimeStr.slice(0, 2) < 20 && data.gameTimeStr.slice(0, 2) > 6 ? data.gameTimeStr.slice(0, 2) > 17 ? ":city_sunset:" : ":park:" : ":bridge_at_night:"

            let hours = data.gameTimeStr.split(":")[0] % 12
            hours = hours ? hours : 12

            if (data.gameTimeStr.split(":")[1] >= 30)
                hours += "30"

            const embed = client.create_embed({
                title: "> This is Weazel News",
                description: `\`\`\`${data.currentWeatherEmoji} - ${data.currentWeatherDescription}\`\`\``,
                fields: [
                    {
                        name: { tls: "game.gta.horario_atual" },
                        value: `:clock${hours}: \`${data.gameTimeStr}\`${emoji_horario}\` \``,
                        inline: true
                    }
                ]
            }, user)

            const row = client.create_buttons([
                { id: "gta_resume", name: { tls: "menu.botoes.atualizar" }, type: 0, emoji: client.emoji(42), data: "0" }
            ], interaction, user)

            client.reply(interaction, {
                embeds: [embed],
                components: [row],
                flags: client.decider(user?.conf.ghost_mode, 0) ? "Ephemeral" : null
            })
        })
        .catch(() => {
            client.reply(interaction, {
                content: client.tls.phrase(user, "game.gta.erro_apisal", client.emoji(0))
            })
        })
}