const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { emojis, emojis_dancantes } = require('../../arquivos/json/text/emojis.json')
const busca_emoji = require('../../adm/discord/busca_emoji')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('⌠💡⌡ Show server information')
        .setDescriptionLocalizations({
            "pt-BR": '⌠💡⌡ Veja informações do servidor',
            "es-ES": '⌠💡⌡ Ver información del servidor',
            "fr": '⌠💡⌡ Afficher les informations du serveur'
        })
        .addSubcommand(subcommand =>
            subcommand
                .setName('icon')
                .setDescription('⌠💡⌡ The Server Icon')
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💡⌡ O Icone do servidor',
                    "es-ES": '⌠💡⌡ El icono del servidor',
                    "fr": '⌠💡⌡ L\'icône du serveur'
                }))
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('⌠💡⌡ Server Information')
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💡⌡ Informações do servidor',
                    "es-ES": '⌠💡⌡ Información del servidor',
                    "fr": '⌠💡⌡ Informations sur le serveur'
                })),
    async execute(client, interaction) {

        const idioma_definido = client.idioma.getLang(interaction)
        const { utilitarios } = require(`../../arquivos/idiomas/${idioma_definido}.json`)
        const user = client.usuarios.getUser(interaction.user.id)

        if (interaction.options.getSubcommand() === "info") {

            const niveis_verificacao = ["NONE", "LOW", "MEDIUM", "HIGH", "HIGHEST"]

            const boost_sv = busca_emoji(client, emojis.boost)
            const emoji_dancando = busca_emoji(client, emojis_dancantes)
            const figurinhas = busca_emoji(client, emojis.bigchad)

            let dono_sv = interaction.guild.ownerId
            const dono_membro = await interaction.guild.members.fetch(dono_sv)
            dono_sv = `\`${dono_membro.user.username.replace(/ /g, "")}#${dono_membro.user.discriminator}\`\n\`${dono_sv}\``

            let icone_server = interaction.guild.iconURL({ size: 2048 })

            const canais_texto = interaction.guild.channels.cache.filter((c) => c.type === 0).size
            const canais_voz = interaction.guild.channels.cache.filter((c) => c.type === 2).size
            const categorias = interaction.guild.channels.cache.filter(c => c.type === 4).size
            const qtd_canais = canais_texto + canais_voz

            const qtd_membros = interaction.guild.memberCount

            const data_entrada = `<t:${Math.floor(interaction.guild.joinedTimestamp / 1000)}:f>` // Entrada do bot no server
            const diferenca_entrada = `<t:${Math.floor(interaction.guild.joinedTimestamp / 1000)}:R>`

            const data_criacao = `<t:${Math.floor(interaction.guild.createdAt / 1000)}:f>` // Criação do servidor
            const diferenca_criacao = `<t:${Math.floor(interaction.guild.createdAt / 1000)}:R>`

            if (icone_server !== null) {
                icone_server = icone_server.replace(".webp", ".gif")

                await fetch(icone_server)
                    .then(res => {
                        if (res.status !== 200)
                            icone_server = icone_server.replace('.gif', '.webp')
                    })
            } else
                icone_server = ""

            const infos_sv = new EmbedBuilder()
                .setTitle(interaction.guild.name)
                .setColor(user.misc.embed)
                .setThumbnail(icone_server)
                .addFields(
                    {
                        name: `:globe_with_meridians: ${utilitarios[12]["id_server"]}`,
                        value: `\`${interaction.guild.id}\``,
                        inline: true
                    },
                    {
                        name: `:busts_in_silhouette: **${utilitarios[12]["membros"]}**`,
                        value: `:bust_in_silhouette: **${utilitarios[12]["atual"]}:** \`${qtd_membros.toLocaleString('pt-BR')}\`\n:arrow_up: **Max: **\`${interaction.guild.maximumMembers.toLocaleString('pt-BR')}\``,
                        inline: true
                    },
                    {
                        name: `:unicorn: **${utilitarios[12]["dono"]}**`,
                        value: dono_sv,
                        inline: true
                    },
                )
                .addFields(
                    {
                        name: `:placard: **${utilitarios[12]["canais"]} ( ${qtd_canais} )**`,
                        value: `:card_box: **${utilitarios[12]["categorias"]}:** \`${categorias}\`\n:notepad_spiral: **${utilitarios[12]["texto"]}:** \`${canais_texto}\`\n:speaking_head: **${utilitarios[12]["voz"]}:** \`${canais_voz}\``,
                        inline: true
                    },
                    {
                        name: `:vulcan: **${utilitarios[12]["entrada"]}**`,
                        value: `${data_entrada}\n[ ${diferenca_entrada} ]`,
                        inline: true
                    },
                    {
                        name: `:birthday: **${utilitarios[12]["criacao"]}**`,
                        value: `${data_criacao}\n[ ${diferenca_criacao} ]`,
                        inline: true
                    }
                )
                .addFields(
                    {
                        name: `:shield: **${utilitarios[12]["verificacao"]}**`,
                        value: `**${utilitarios[12][niveis_verificacao[interaction.guild.verificationLevel]]}**`,
                        inline: true
                    },
                    {
                        name: `${emoji_dancando} **Emojis ( ${interaction.guild.emojis.cache.size} )**`,
                        value: `${figurinhas} **${utilitarios[12]["figurinhas"]} ( ${interaction.guild.stickers.cache.size} )**`,
                        inline: true
                    }
                )

            if (interaction.guild.premiumSubscriptionCount > 0)
                infos_sv.addFields(
                    {
                        name: `${boost_sv} **Boosts ( ${interaction.guild.premiumSubscriptionCount} )**`,
                        value: `:passport_control: **${utilitarios[12]["cargos"]}: ** \`${interaction.guild.roles.cache.size - 1}\``,
                        inline: true
                    }
                )
            else
                infos_sv.addFields(
                    { name: `:passport_control: **${utilitarios[12]["cargos"]} ( ${interaction.guild.roles.cache.size - 1} )**`, value: '⠀', inline: true }
                )

            return interaction.reply({ embeds: [infos_sv] })
        } else { // Icone do servidor

            let icone_server = interaction.guild.iconURL({ size: 2048 })
            icone_server = icone_server.replace(".webp", ".gif")

            fetch(icone_server)
                .then(res => {
                    if (res.status !== 200)
                        icone_server = icone_server.replace('.gif', '.webp')

                    const embed = new EmbedBuilder()
                        .setTitle(interaction.guild.name)
                        .setDescription(utilitarios[4]["download_icon"].replace("link_repl", icone_server))
                        .setColor(user.misc.embed)
                        .setImage(icone_server)

                    return interaction.reply({ embeds: [embed], ephemeral: true })
                })
        }
    }
}