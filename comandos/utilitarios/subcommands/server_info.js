const { EmbedBuilder } = require('discord.js')

const { emojis_dancantes } = require('../../../arquivos/json/text/emojis.json')

module.exports = async ({ client, user, interaction }) => {

    const niveis_verificacao = ["NONE", "LOW", "MEDIUM", "HIGH", "HIGHEST"]

    let dono_sv = interaction.guild.ownerId
    const dono_membro = await interaction.guild.members.fetch(dono_sv)

    dono_sv = `\`${dono_membro.user.username.replace(/ /g, "")}#${dono_membro.user.discriminator}\`\n( ${dono_membro} )`

    if (dono_membro.user.discriminator == 0)
        dono_sv = `\`@${dono_membro.user.username.replace(/ /g, "")}\`\n( ${dono_membro} )`

    const icone_server = interaction.guild.iconURL({ size: 2048 })

    const canais_texto = interaction.guild.channels.cache.filter((c) => c.type === 0).size
    const canais_voz = interaction.guild.channels.cache.filter((c) => c.type === 2).size
    const categorias = interaction.guild.channels.cache.filter(c => c.type === 4).size
    const qtd_canais = canais_texto + canais_voz

    const qtd_membros = interaction.guild.memberCount

    const data_entrada = `<t:${Math.floor(interaction.guild.joinedTimestamp / 1000)}:f>` // Entrada do bot no server
    const diferenca_entrada = `<t:${Math.floor(interaction.guild.joinedTimestamp / 1000)}:R>`

    const data_criacao = `<t:${Math.floor(interaction.guild.createdAt / 1000)}:f>` // Criação do servidor
    const diferenca_criacao = `<t:${Math.floor(interaction.guild.createdAt / 1000)}:R>`

    const infos_sv = new EmbedBuilder()
        .setTitle(interaction.guild.name)
        .setColor(client.embed_color(user.misc.color))
        .setThumbnail(icone_server)
        .addFields(
            {
                name: `:globe_with_meridians: ${client.tls.phrase(user, "util.server.id_server")}`,
                value: `\`${interaction.guild.id}\``,
                inline: true
            },
            {
                name: `:busts_in_silhouette: **${client.tls.phrase(user, "util.server.membros")}**`,
                value: `:bust_in_silhouette: **${client.tls.phrase(user, "util.server.atual")}:** \`${client.locale(qtd_membros)}\`\n:arrow_up: **Max: **\`${client.locale(interaction.guild.maximumMembers)}\``,
                inline: true
            },
            {
                name: `:unicorn: **${client.tls.phrase(user, "util.server.dono")}**`,
                value: dono_sv,
                inline: true
            },
        )
        .addFields(
            {
                name: `:placard: **${client.tls.phrase(user, "util.server.canais")} ( ${qtd_canais} )**`,
                value: `:card_box: **${client.tls.phrase(user, "util.server.categorias")}:** \`${categorias}\`\n:notepad_spiral: **${client.tls.phrase(user, "util.server.texto")}:** \`${canais_texto}\`\n:speaking_head: **${client.tls.phrase(user, "util.server.voz")}:** \`${canais_voz}\``,
                inline: true
            },
            {
                name: `:vulcan: **${client.tls.phrase(user, "util.server.entrada")}**`,
                value: `${data_entrada}\n[ ${diferenca_entrada} ]`,
                inline: true
            },
            {
                name: `:birthday: **${client.tls.phrase(user, "util.server.criacao")}**`,
                value: `${data_criacao}\n[ ${diferenca_criacao} ]`,
                inline: true
            }
        )
        .addFields(
            {
                name: `:shield: **${client.tls.phrase(user, "util.server.verificacao")}**`,
                value: `**${client.tls.phrase(user, `util.server.${niveis_verificacao[interaction.guild.verificationLevel]}`)}**`,
                inline: true
            },
            {
                name: `${client.emoji(emojis_dancantes)} **Emojis ( ${interaction.guild.emojis.cache.size} )**`,
                value: `${client.emoji("bigchad")} **${client.tls.phrase(user, "util.server.figurinhas")} ( ${interaction.guild.stickers.cache.size} )**`,
                inline: true
            }
        )

    if (interaction.guild.premiumSubscriptionCount > 0)
        infos_sv.addFields(
            {
                name: `${client.emoji("boost")} **Boosts ( ${interaction.guild.premiumSubscriptionCount} )**`,
                value: `:passport_control: **${client.tls.phrase(user, "util.server.cargos")}: ** \`${interaction.guild.roles.cache.size - 1}\``,
                inline: true
            }
        )
    else
        infos_sv.addFields(
            {
                name: `:passport_control: **${client.tls.phrase(user, "util.server.cargos")} ( ${interaction.guild.roles.cache.size - 1} )**`,
                value: '⠀',
                inline: true
            }
        )

    return interaction.reply({ embeds: [infos_sv], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
}