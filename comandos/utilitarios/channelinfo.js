const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cinfo')
        .setDescription('⌠💡⌡ Show channel details')
        .setDescriptionLocalizations({
            "pt-BR": '⌠💡⌡ Veja detalhes de algum canal',
            "es-ES": '⌠💡⌡ Ver detalles del canal',
            "fr": '⌠💡⌡ Afficher les détails de la chaîne'
        })
        .addChannelOption(option =>
            option.setName('channel')
                .setNameLocalizations({
                    "pt-BR": 'canal',
                    "es-ES": 'canal',
                    "fr": 'chaîne'
                })
                .setDescription('Mention a channel')
                .setDescriptionLocalizations({
                    "pt-BR": 'Marque um canal como alvo',
                    "es-ES": 'Mencionar un canal como objetivo',
                    "fr": 'mentionner une chaîne'
                })),
    async execute(client, interaction) {

        const { utilitarios } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const user = client.usuarios.getUser(interaction.user.id)

        let canal = interaction.options.getChannel('canal') || interaction.options.getChannel('channel') || interaction.options.getChannel('chaîne') || interaction.channel
        // Coletando os dados do canal informado

        let nsfw = utilitarios[9]["nao"]
        if (canal.nsfw)
            nsfw = utilitarios[9]["sim"]

        const data_criacao = `<t:${Math.floor(canal.createdAt / 1000)}:f>` // Criação do canal
        const diferenca_criacao = `<t:${Math.floor(canal.createdAt / 1000)}:R>`
        let userlimit, bitrate = ""

        let topico = `\`\`\`${canal.topic}\`\`\``
        if (!canal.topic)
            topico = `\`\`\`${utilitarios[15]["sem_topico"]}\`\`\``

        if (typeof canal.bitrate !== "undefined") {
            topico = `\`\`\`🔊 ${utilitarios[15]["canal_voz"]}\`\`\``

            userlimit = canal.userLimit

            if (userlimit === 0)
                userlimit = utilitarios[15]["sem_limite"]

            bitrate = `${canal.bitrate / 1000}kbps`
        }

        let icone_server = canal.guild.iconURL({ size: 2048 })
        icone_server = icone_server.replace(".webp", ".gif")

        fetch(icone_server)
            .then(res => {
                if (res.status !== 200)
                    icone_server = icone_server.replace('.gif', '.webp')

                const infos_ch = new EmbedBuilder()
                    .setAuthor({ name: canal.name, iconURL: icone_server })
                    .setColor(user.color)
                    .setDescription(topico)
                    .addFields(
                        {
                            name: `:globe_with_meridians: **${utilitarios[15]["id_canal"]}**`,
                            value: `\`${canal.id}\``,
                            inline: true
                        },
                        {
                            name: `:label: **${utilitarios[15]["mencao"]}**`,
                            value: `\`<#${canal.id}>\``,
                            inline: true
                        },
                    )

                if (bitrate === "")
                    infos_ch.addFields(
                        {
                            name: ':underage: NSFW',
                            value: `\`${nsfw}\``,
                            inline: true
                        }
                    )
                else
                    infos_ch.addFields({ name: '⠀', value: '⠀', inline: true })

                infos_ch.addFields(
                    {
                        name: `:birthday: ${utilitarios[12]["criacao"]}`,
                        value: `${data_criacao}\n [ ${diferenca_criacao} ]`,
                        inline: true
                    }
                )

                if (typeof canal.bitrate !== "undefined")
                    infos_ch.addFields(
                        {
                            name: `:mega: ${utilitarios[15]["transmissao"]}`,
                            value: `:radio: **Bitrate: **\`${bitrate}\`\n:busts_in_silhouette: **Max. users: **\`${userlimit}\``,
                            inline: true
                        }
                    )

                if (typeof canal.rateLimitPerUser !== "undefined")
                    if (canal.rateLimitPerUser > 0)
                        infos_ch.addFields(
                            {
                                name: `:name_badge: ${utilitarios[15]["modo_lento"]}`,
                                value: `\`${canal.rateLimitPerUser} segundos\``,
                                inline: true
                            }
                        )

                return interaction.reply({ embeds: [infos_ch] })
            })
    }
}