const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

module.exports = async ({ client }) => {

    client.idioma.loadAll(client)

    // Não notifica que o bot ficou online
    if (client.x.status) {

        console.log("🟠 | Disparando status")

        fetch(`${process.env.url_apisal}/status`)
            .then(res => res.json())
            .then(retorno => {

                let status_apisal = "🛑 Offline"
                if (retorno.status)
                    status_apisal = "✅ Online"

                dispara_status(client, status_apisal)
            })
            .catch(() => dispara_status(client, "🛑 Offline"))
    }

    // Status personalizados
    require('./presence')({ client })

    setTimeout(() => {
        client.idioma.listAll()
    }, 2000)
}

dispara_status = (client, status_apisal) => {

    if (process.env.channel_status) {
        setTimeout(async () => {

            const bot = await client.getBot()

            const commit_language = bot.persis.alondioma
            const canais_texto = client.channels(0).size
            let members = 0

            client.guilds().forEach(async guild => { members += guild.memberCount - 1 })

            let bandeira_idiomas = client.idioma.listAll().split(" ")
            let counter = 0, bandeirolas_1 = [], bandeirolas_2 = []

            for (let i = 0; i < bandeira_idiomas.length; i++) {

                if (counter < 4)
                    bandeirolas_1.push(bandeira_idiomas[i])
                else
                    bandeirolas_2.push(bandeira_idiomas[i])

                if (counter === 4)
                    bandeirolas_1.push("\n")

                if (i % 7 === 0) {
                    counter = 0
                    bandeirolas_2.push("\n")
                }

                counter++
            }

            const embed = client.create_embed({
                title: ":steam_locomotive: Caldeiras aquecidas",
                color: "turquesa",
                fields: [
                    {
                        name: ":globe_with_meridians: **Servidores**",
                        value: `${client.defaultEmoji("heart")} **Ativo: **\`${client.execute("locale", { valor: client.guilds().size })}\`\n:card_box: **Canais: **\`${client.execute("locale", { valor: canais_texto })}\`\n${client.defaultEmoji("person")} **Usuários: **\`${client.execute("locale", { valor: members })}\``,
                        inline: true
                    },
                    { name: "⠀", value: "⠀", inline: true },
                    {
                        name: `:white_small_square: **Versão ${bot.persis.version}**`,
                        value: "⠀",
                        inline: true
                    },
                    {
                        name: ":moyai: **APISAL**",
                        value: `\`${status_apisal}\``,
                        inline: true
                    },
                    {
                        name: `${client.defaultEmoji("earth")} **Idiomas**`,
                        value: bandeirolas_1.join(" "),
                        inline: true
                    },
                    {
                        name: `💠 ${commit_language}`,
                        value: bandeirolas_2.join(" "),
                        inline: true
                    }
                ],
                timestamp: true
            })

            console.log("🟢 | Status enviado")

            // Avisando que o bot está online em um canal
            client.execute("notify", {
                id_canal: process.env.channel_status,
                conteudo: { embeds: [embed] }
            })
        }, 3000)
    }
}