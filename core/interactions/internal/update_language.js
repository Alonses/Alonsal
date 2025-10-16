const { existsSync, mkdirSync, writeFileSync } = require('fs')

const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

module.exports = async ({ client, interaction }) => {

    if (!existsSync(`./files/languages/`))
        mkdirSync(`./files/languages/`, { recursive: true })

    const bot = await client.getBot()
    await interaction.deferReply({ flags: "Ephemeral" })
    let cod_commit

    fetch("https://github.com/Alonses/Alondioma")
        .then(response => response.text())
        .then(async res => {

            // Salvando o commit de traduções mais recente no banco 
            cod_commit = res.split("currentOid\":\"")[1].slice(0, 7)

            bot.persis.alondioma = cod_commit
            await bot.save()

            if (client.id() === process.env.client_1) // Notifica apenas caso seja o bot principal
                client.execute("notify", {
                    id_canal: process.env.channel_feeds,
                    conteudo: { content: `:sa: | Pacote de traduções do ${client.username()} sincronizado com o commit \`${cod_commit}\`` }
                })

            fetch("https://api.github.com/repos/Alonses/Alondioma/contents/")
                .then(res => res.json())
                .then(content => {
                    for (let i = 0; i < content.length; i++) {
                        const idioma = content[i]

                        if (!idioma.name.endsWith(".json")) continue

                        fetch(idioma.download_url)
                            .then(res => res.json())
                            .then(res => {
                                writeFileSync(`./files/languages/${idioma.name}`, JSON.stringify(res))
                            })
                            .catch(() => {
                                return interaction.editReply({
                                    content: `${client.emoji("mc_wax")} | Houve um problema ao sincronizar a tradução com o repositório do \`Alondioma\``,
                                    flags: "Ephemeral"
                                })
                            })
                    }
                })
        })
        .then(() => {
            return interaction.editReply({
                content: `:sa: | Pacote de traduções do Alonsal sincronizado com o commit \`${cod_commit}\``,
                flags: "Ephemeral"
            })
        })
}