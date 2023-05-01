const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

const { mkdirSync, writeFileSync, existsSync } = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("c_update_language")
        .setDescription("⌠🤖⌡ Atualizar as traduções do bot manualmente")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute(client, user, interaction) {

        if (!client.owners.includes(interaction.user.id)) return

        if (!existsSync(`./arquivos/idiomas/`))
            mkdirSync(`./arquivos/idiomas/`, { recursive: true })

        const bot = await client.getBot()

        fetch("https://github.com/Alonses/Alondioma")
            .then(response => response.text())
            .then(async res => {

                // Salvando o commit de traduções mais recente no banco 
                const cod_commit = res.split("<include-fragment src=\"/Alonses/Alondioma/spoofed_commit_check/")[1].split("\"")[0].slice(0, 7)

                bot.persis.alondioma = cod_commit
                await bot.save()

                interaction.reply({ content: `:sa: | Baixando o pacote de traduções do commit \`${cod_commit}\``, ephemeral: true })

                if (client.id() === process.env.client_1) // Notifica apenas caso seja o bot principal
                    client.notify(process.env.channel_feeds, `:sa: | Pacote de traduções do ${client.user().username} sincronizado com o commit \`${cod_commit}\``)

                fetch("https://api.github.com/repos/Alonses/Alondioma/contents/")
                    .then(res => res.json())
                    .then(content => {
                        for (let i = 0; i < content.length; i++) {
                            const idioma = content[i]

                            if (!idioma.name.endsWith(".json")) continue

                            fetch(idioma.download_url)
                                .then(res => res.json())
                                .then(res => {
                                    writeFileSync(`./arquivos/idiomas/${idioma.name}`, JSON.stringify(res))
                                })
                        }
                    })
            })
    }
}