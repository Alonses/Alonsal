const { EmbedBuilder, PermissionsBitField } = require('discord.js')

const { loggerMap } = require("../../../database/schemas/Guild")
const { spamTimeoutMap } = require("../../../database/schemas/Strikes")

const { getUserWarns, removeWarn } = require("../../../database/schemas/Warns")
const { listAllGuildWarns } = require('../../../database/schemas/Warns_guild')

module.exports = async ({ client, user, interaction, dados }) => {

    const id_alvo = dados.split(".")[2]
    const id_executor = interaction.user.id
    const operacao = parseInt(dados.split(".")[1])

    const member_guild = await client.getMemberGuild(interaction, id_alvo)
    const user_warns = await getUserWarns(id_alvo, interaction.guild.id)

    if (operacao === 0) { // Operação cancelada

        if (user_warns.total === -1) // Removendo a advertência do banco de dados
            await removeWarn(id_alvo, interaction.guild.id)

        return client.reply(interaction, {
            content: client.tls.phrase(user, "mode.warn.advertencia_cancelada", client.emoji(0)),
            embeds: [],
            components: [],
            ephemeral: true
        })
    }

    const user_alvo = await client.getUser(id_alvo)
    const guild_warns = await listAllGuildWarns(interaction.guild.id)
    const guild = await client.getGuild(interaction.guild.id)

    let indice_matriz = client.verifyGuildWarns(guild_warns) // Indice marcador do momento de expulsão/banimento do membro pelas advertências

    // Acrescentando mais uma advertência ao usuário e registrando o último moderador
    if (user_warns.total < guild_warns.length - 1)
        user_warns.total++

    // Verificando se existem advertências para as próximas punições do usuário
    if (!guild_warns[user_warns.total])
        user_warns.total = guild_warns.length - 1

    user_warns.assigner = interaction.user.id
    await user_warns.save()

    let texto_rodape = client.tls.phrase(user_alvo, "mode.warn.aviso_penalidade")

    const embed_user = new EmbedBuilder()
        .setTitle(`${client.tls.phrase(user_alvo, "mode.warn.titulo_advertencia")} :inbox_tray:`)
        .setColor(0xED4245)
        .setDescription(client.replace(client.tls.phrase(user_alvo, "mode.warn.advertencia_recebida"), [interaction.guild.name, user_warns.relatory]))
        .addFields(
            {
                name: `${client.defaultEmoji("guard")} **Moderador responsável**`,
                value: `${client.emoji("icon_id")} \`${id_executor}\`\n\`${interaction.user.username}\`\n( <@${id_executor}> )`,
                inline: true
            },
            {
                name: `${client.emoji("banidos")} **Punição**`,
                value: client.verifyWarnAction(guild_warns[user_warns.total], guild),
                inline: true
            },
            {
                name: `${client.emoji(47)} **Advertências: ${user_warns.total + 1} / ${indice_matriz}**`,
                value: "⠀",
                inline: true
            }
        )
        .setFooter({
            text: texto_rodape,
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    // Avisando o usuário sobre a advertência
    await client.sendDM(user_alvo, { embed: embed_user }, true)

    // Enviando um embed para o servidor
    const embed_guild = new EmbedBuilder()
        .setTitle(`${client.tls.phrase(guild, "mode.warn.titulo_advertencia")} :inbox_tray:`)
        .setColor(0xED4245)
        .setDescription(`${client.tls.phrase(guild, "mode.warn.usuario_nova_advertencia")}!\n\`\`\`fix\n📠 | ${client.tls.phrase(guild, "mode.warn.descricao_fornecida")}\n\n${user_warns.relatory}\`\`\``)
        .addFields(
            {
                name: `:bust_in_silhouette: **${client.tls.phrase(user, "mode.report.usuario")}**`,
                value: `${client.emoji("icon_id")} \`${id_alvo}\`\n\`${user_warns.nick}\`\n( <@${id_alvo}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("calendar")} **${client.tls.phrase(guild, "mode.logger.entrada_original")}**`,
                value: `<t:${parseInt(member_guild.joinedTimestamp / 1000)}:F>`,
                inline: true
            },
            {
                name: `${client.emoji(47)} **Advertências: ${user_warns.total + 1} / ${indice_matriz}**`,
                value: "⠀",
                inline: true
            }
        )
        .addFields(
            {
                name: `${client.defaultEmoji("guard")} **Moderador responsável**`,
                value: `${client.emoji("icon_id")} \`${id_executor}\`\n\`${interaction.user.username}\`\n( <@${id_executor}> )`,
                inline: true
            }
        )
        .setTimestamp()

    if (guild.warn.timed) { // Advertência com prazo de expiração
        embed_guild.addFields({
            name: `${client.defaultEmoji("time")} **Expiração**`,
            value: `**Será removida em \`${client.tls.phrase(user, `menu.times.${spamTimeoutMap[guild.warn.reset]}`)}\`**\n( <t:${client.timestamp() + spamTimeoutMap[guild.warn.reset]}:f> )`,
            inline: true
        })
            .setFooter({
                text: "Você pode desligar a expiração de advertências no /painel guild pela guia de \"🛑 Advertências\"",
                iconURL: interaction.user.avatarURL({ dynamic: true })
            })
    } else
        embed_guild.addFields(
            {
                name: "⠀",
                value: "⠀",
                inline: true
            }
        )

    embed_guild.addFields({
        name: `${client.emoji("banidos")} **Punição**`,
        value: client.verifyWarnAction(guild_warns[user_warns.total], guild),
        inline: true
    })

    client.notify(guild.warn.channel, {
        content: guild.warn.notify ? "@here" : "", // Servidor com ping de advertência ativo
        embeds: [embed_guild]
    })

    if (guild_warns[user_warns.total].action) // Usuário recebeu a uma advertência com penalidade
        if (guild_warns[user_warns.total].action !== "none") {

            const guild_member = await client.getMemberPermissions(interaction.guild.id, id_alvo)
            const guild_executor = await client.getMemberPermissions(interaction.guild.id, interaction.user.id)
            const bot_member = await client.getMemberPermissions(interaction.guild.id, client.id())

            // Redirecionando o evento
            require(`../../../events/warn/${guild_warns[user_warns.total].action.replace("_2", "")}`)({ client, user, interaction, guild, user_warns, guild_member, guild_executor, bot_member })
        }

    if (guild_warns[user_warns.total].role) { // Advertência atual acrescenta um cargo

        // Permissões do bot no servidor
        const membro_sv = await client.getMemberGuild(interaction, client.id())
        const membro_guild = await client.getMemberGuild(interaction, id_alvo)

        if (membro_sv.permissions.has(PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.Administrator)) {

            // Atribuindo o cargo ao usuário que recebeu a advertência
            let role = interaction.guild.roles.cache.get(guild_warns[user_warns.total].role)

            if (role.editable) // Verificando se o cargo é editável
                membro_guild.roles.add(role).catch(console.error)
        }
    }

    return client.reply(interaction, {
        content: `:inbox_tray: | ${client.tls.phrase(user, "mode.warn.advertencia_registrada")}`,
        embeds: [],
        components: [],
        ephemeral: true
    })
}