const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { EmbedBuilder, PermissionsBitField } = require('discord.js')

const { buildAllBadges } = require('../../../adm/data/badges')

const { emojis } = require('../../../arquivos/json/text/emojis.json')

module.exports = async ({ client, user, interaction }) => {

    let user_alvo = interaction.options.getUser("user") || interaction.user
    const user_c = await client.getUser(user_alvo.id)

    let avatar_user = `https://cdn.discordapp.com/avatars/${user_alvo.id}/${user_alvo.avatar}.gif?size=1024`

    const membro_sv = await client.getUserGuild(interaction, user_alvo.id) // Coleta dados como membro
    let data_entrada = `<t:${Math.floor(membro_sv.joinedTimestamp / 1000)}:f>`
    let diferenca_entrada = `<t:${Math.floor(membro_sv.joinedTimestamp / 1000)}:R>`

    let data_criacao = `<t:${Math.floor(user_alvo.createdAt / 1000)}:f>` // Cadastro do usuário
    let diferenca_criacao = `<t:${Math.floor(user_alvo.createdAt / 1000)}:R>`
    let nota_rodape = ""

    let apelido = membro_sv.user.username, tipo_user = "🤖"

    if (avatar_user !== null) {

        await fetch(avatar_user)
            .then(res => {
                if (res.status !== 200)
                    avatar_user = avatar_user.replace('.gif', '.webp')
            })
    } else
        avatar_user = ""

    if (membro_sv.user.nickname)
        apelido = membro_sv.user.nickname

    if (membro_sv.permissions.has(PermissionsBitField.Flags.Administrator)) {
        tipo_user = "🛡️"
        nota_rodape = client.tls.phrase(user, "util.user.moderador")
    }

    if (!tipo_user.includes("🛡️") && !user_alvo.bot)
        tipo_user = client.defaultEmoji("person")

    if (user_alvo.id === client.id())
        nota_rodape = client.tls.phrase(user, "util.user.alonsal")

    if (process.env.ids_enceirados.includes(user_alvo.id)) {
        if (nota_rodape !== "")
            nota_rodape += ", "

        nota_rodape += client.tls.phrase(user, "util.user.enceirado")
    }

    const permissoes_user = membro_sv.permissions.toArray()
    let permissoes_fn = ""

    for (let i = 0; i < permissoes_user.length; i++) {
        if (typeof permissoes_user[i + 1] === "undefined")
            permissoes_fn += " & "

        permissoes_fn += `\`${permissoes_user[i]}\``

        if (typeof permissoes_user[i + 2] !== "undefined")
            permissoes_fn += ", "
    }

    permissoes_fn = permissoes_fn.slice(0, 2000)
    let emoji_hypesquad = "⠀", discord_premium = "⠀"
    const flags_user = user_alvo.flags.toArray()

    if (!user_alvo.bot) {
        if (flags_user.includes("HypeSquadOnlineHouse1")) // HypeSquad
            emoji_hypesquad = client.emoji(emojis.squad_bravery)

        if (flags_user.includes("HypeSquadOnlineHouse2"))
            emoji_hypesquad = client.emoji(emojis.squad_brilliance)

        if (flags_user.includes("HypeSquadOnlineHouse3"))
            emoji_hypesquad = client.emoji(emojis.squad_balance)

        if (flags_user.includes("PremiumEarlySupporter"))
            discord_premium = client.emoji(emojis.early_supporter)

        if (membro_sv.premiumSinceTimestamp) // Impulsionadores do servidor
            discord_premium += ` ${client.emoji(emojis.boost)}`
    }

    let id_badges = await client.getUserBadges(user_alvo.id)
    let badges = await buildAllBadges(client, user, id_badges)
    // let achievements = busca_achievements(client, all, user.id, interaction)

    let nome_usuario = `\`${user_alvo.username.replace(/ /g, "")}#${user_alvo.discriminator}\``

    // Usuário sem discriminador
    if (user_alvo.discriminator == 0)
        nome_usuario = `\`@${user_alvo.username.replace(/ /g, "")}\``

    const infos_user = new EmbedBuilder()
        .setTitle(`> ${apelido} ${emoji_hypesquad} ${discord_premium}`)
        .setColor(client.embed_color(user_c.misc.color))
        .setThumbnail(avatar_user)
        .addFields(
            {
                name: ":globe_with_meridians: **Discord**",
                value: `${nome_usuario}\n( <@${user_alvo.id}>)`,
                inline: true
            },
            {
                name: ":label: **Discord ID**",
                value: `\`${user_alvo.id}\``,
                inline: true
            }
        )
        .addFields(
            {
                name: `:birthday: **${client.tls.phrase(user, "util.user.conta_criada")}**`,
                value: `${data_criacao}\n[ ${diferenca_criacao} ]`,
                inline: false
            },
            {
                name: `:parachute: **${client.tls.phrase(user, "util.user.entrada")}**`,
                value: `${data_entrada}\n[ ${diferenca_entrada} ]`,
                inline: false
            }
        )
        .setFooter({ text: `${tipo_user} ${nota_rodape}` })

    if (badges.length > 0)
        infos_user.addFields({
            name: ":trophy: **Badges**",
            value: badges,
            inline: false
        })

    return interaction.reply({ embeds: [infos_user], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
}