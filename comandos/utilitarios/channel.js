const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("channel")
        .setDescription("⌠💡⌡ Show channel details")
        .setDescriptionLocalizations({
            "pt-BR": '⌠💡⌡ Veja detalhes de algum canal',
            "es-ES": '⌠💡⌡ Ver detalles del canal',
            "fr": '⌠💡⌡ Afficher les détails de la chaîne',
            "it": '⌠💡⌡ Visualizza i dettagli del canale',
            "ru": '⌠💡⌡ Подробнее о канале'
        })
        .addChannelOption(option =>
            option.setName("channel")
                .setNameLocalizations({
                    "pt-BR": 'canal',
                    "es-ES": 'canal',
                    "fr": 'chaîne',
                    "it": 'canale',
                    "ru": 'канал'
                })
                .setDescription("Mention a channel")
                .setDescriptionLocalizations({
                    "pt-BR": 'Marque um canal como alvo',
                    "es-ES": 'Mencionar un canal como objetivo',
                    "fr": 'Mentionner une chaîne',
                    "it": 'Menzionare un canale',
                    "ru": 'упомянуть канал'
                })),
    async execute(client, user, interaction) {

        let canal = interaction.options.getChannel("channel") || interaction.channel
        // Coletando os dados do canal informado

        let nsfw = client.tls.phrase(user, "util.minecraft.nao")
        if (canal.nsfw)
            nsfw = client.tls.phrase(user, "util.minecraft.sim")

        const data_criacao = `<t:${Math.floor(canal.createdAt / 1000)}:f>` // Criação do canal
        const diferenca_criacao = `<t:${Math.floor(canal.createdAt / 1000)}:R>`
        let userlimit, bitrate = ""

        let topico = `\`\`\`${canal.topic || client.tls.phrase(user, "util.canal.sem_topico")}\`\`\``

        if (typeof canal.bitrate !== "undefined") {
            topico = `\`\`\`🔊 ${client.tls.phrase(user, "util.canal.canal_voz")}\`\`\``

            userlimit = canal.userLimit

            if (userlimit === 0)
                userlimit = client.tls.phrase(user, "util.canal.sem_limites")

            bitrate = `${canal.bitrate / 1000}kbps`
        }

        let icone_server = canal.guild.iconURL({ size: 2048 }).replace(".webp", ".gif")

        fetch(icone_server)
            .then(res => {
                if (res.status !== 200)
                    icone_server = icone_server.replace(".gif", ".webp")

                const infos_ch = new EmbedBuilder()
                    .setAuthor({ name: canal.name, iconURL: icone_server })
                    .setColor(client.embed_color(user.misc.color))
                    .setDescription(topico)
                    .addFields(
                        {
                            name: `:globe_with_meridians: **${client.tls.phrase(user, "util.canal.id_canal")}**`,
                            value: `\`${canal.id}\``,
                            inline: true
                        },
                        {
                            name: `:label: **${client.tls.phrase(user, "util.canal.mencao")}**`,
                            value: `\`<#${canal.id}>\``,
                            inline: true
                        },
                    )

                if (bitrate === "")
                    infos_ch.addFields(
                        {
                            name: ":underage: NSFW",
                            value: `\`${nsfw}\``,
                            inline: true
                        }
                    )
                else
                    infos_ch.addFields({ name: "⠀", value: "⠀", inline: true })

                infos_ch.addFields(
                    {
                        name: `:birthday: ${client.tls.phrase(user, "util.server.criacao")}`,
                        value: `${data_criacao}\n [ ${diferenca_criacao} ]`,
                        inline: true
                    }
                )

                if (typeof canal.bitrate !== "undefined")
                    infos_ch.addFields(
                        {
                            name: `:mega: ${client.tls.phrase(user, "util.canal.transmissao")}`,
                            value: `:radio: **Bitrate: **\`${bitrate}\`\n:busts_in_silhouette: **Max. users: **\`${userlimit}\``,
                            inline: true
                        }
                    )

                if (typeof canal.rateLimitPerUser !== "undefined")
                    if (canal.rateLimitPerUser > 0)
                        infos_ch.addFields(
                            {
                                name: `:name_badge: ${client.tls.phrase(user, "util.canal.modo_lento")}`,
                                value: `\`${canal.rateLimitPerUser} ${client.tls.phrase(user, "util.unidades.segundos")}\``,
                                inline: true
                            }
                        )

                interaction.reply({ embeds: [infos_ch], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
            })
    }
}