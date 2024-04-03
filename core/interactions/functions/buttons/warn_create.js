const { EmbedBuilder, PermissionsBitField } = require('discord.js')

const { spamTimeoutMap } = require("../../../database/schemas/Strikes")

const { removeUserWarn, listAllCachedUserWarns, listAllUserWarns } = require("../../../database/schemas/Warns")
const { listAllGuildWarns } = require('../../../database/schemas/Warns_guild')

module.exports = async ({ client, user, interaction, dados }) => {

    const id_alvo = dados.split(".")[2]
    const id_executor = interaction.user.id
    const operacao = parseInt(dados.split(".")[1])

    // Rascunhos de advertências salvas em cache
    const user_warns = await listAllCachedUserWarns(id_alvo, interaction.guild.id)

    if (operacao === 0) { // Operação cancelada

        // Excluindo a advertência registrada em cache
        await removeUserWarn(id_alvo, interaction.guild.id, user_warns[user_warns.length - 1].timestamp)

        return client.reply(interaction, {
            content: client.tls.phrase(user, "mode.warn.advertencia_cancelada", client.emoji(0)),
            embeds: [],
            components: [],
            ephemeral: true
        })
    }

    // Advertência confirmada
    const guild = await client.getGuild(interaction.guild.id)
    const guild_warns = await listAllGuildWarns(interaction.guild.id)

    const user_alvo = await client.getUser(id_alvo)
    const user_warn = user_warns[user_warns.length - 1]
    const member_guild = await client.getMemberGuild(interaction, id_alvo)

    // Validando a advertência
    user_warn.valid = true
    await user_warn.save()

    const active_user_warns = await listAllUserWarns(id_alvo, interaction.guild.id)
    const indice_warn = active_user_warns.length > guild_warns.length ? guild_warns.length - 1 : active_user_warns.length - 1

    let indice_matriz = client.verifyGuildWarns(guild_warns) // Indice marcador do momento de expulsão/banimento do membro pelas advertências
    let texto_rodape = client.tls.phrase(user_alvo, "mode.warn.punicao_nao_aplicada")

    if (guild_warns[indice_warn].action)
        if (guild_warns[indice_warn].action !== "none")
            texto_rodape = client.tls.phrase(user_alvo, "mode.warn.punicao_aplicada")

    // Embed de aviso para o servidor onde foi aplicada a advertência
    const embed_guild = new EmbedBuilder()
        .setTitle(`${client.tls.phrase(guild, "mode.warn.titulo_advertencia")} :inbox_tray:`)
        .setColor(0xED4245)
        .setDescription(`${client.tls.phrase(guild, "mode.warn.usuario_nova_advertencia")}!\n\`\`\`fix\n📠 | ${client.tls.phrase(guild, "mode.warn.descricao_fornecida")}\n\n${user_warn.relatory}\`\`\``)
        .addFields(
            {
                name: `:bust_in_silhouette: **${client.tls.phrase(guild, "mode.report.usuario")}**`,
                value: `${client.emoji("icon_id")} \`${id_alvo}\`\n\`${user_warn.nick}\`\n( <@${id_alvo}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("calendar")} **${client.tls.phrase(guild, "util.user.entrada")}**`,
                value: `<t:${parseInt(member_guild.joinedTimestamp / 1000)}:F>`,
                inline: true
            },
            {
                name: `${client.emoji(47)} **${client.tls.phrase(guild, "mode.warn.advertencias")}: ${active_user_warns.length} / ${indice_matriz}**`,
                value: "⠀",
                inline: true
            }
        )
        .addFields(
            {
                name: `${client.defaultEmoji("guard")} **${client.tls.phrase(guild, "mode.warn.moderador_responsavel")}**`,
                value: `${client.emoji("icon_id")} \`${id_executor}\`\n\`${interaction.user.username}\`\n( <@${id_executor}> )`,
                inline: true
            }
        )
        .setTimestamp()

    if (guild.warn.timed) { // Advertência com prazo de expiração
        embed_guild.addFields({
            name: `${client.defaultEmoji("time")} **${client.tls.phrase(guild, "menu.botoes.expiracao")}**`,
            value: `**${client.tls.phrase(guild, "mode.warn.remocao_em")} \`${client.tls.phrase(guild, `menu.times.${spamTimeoutMap[guild.warn.reset]}`)}\`**\n( <t:${client.timestamp() + spamTimeoutMap[guild.warn.reset]}:f> )`,
            inline: true
        })
            .setFooter({
                text: client.tls.phrase(guild, "mode.warn.dica_expiracao_rodape"),
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
        name: `${client.emoji("banidos")} **${client.tls.phrase(guild, "menu.botoes.penalidade")}**`,
        value: client.verifyWarnAction(guild_warns[indice_warn], guild),
        inline: true
    })

    let canal_envio = guild.warn.channel, texto_embed = guild.warn.notify ? "@here" : ""

    // Servidor com anúncio de advertências público configurado
    if (guild.warn?.announce.status && guild.warn?.announce.channel) {
        canal_envio = guild.warn.announce.channel
        texto_embed = `<@${id_alvo}>`

        embed_guild.setDescription(`\`\`\`fix\n📠 | ${client.tls.phrase(guild, "mode.warn.descricao_fornecida")}\n\n${user_warn.relatory}\`\`\``)
            .setFooter({
                text: "⠀",
                iconURL: interaction.user.avatarURL({ dynamic: true })
            })
    }

    client.notify(canal_envio, {
        content: texto_embed, // Servidor com ping de advertência ativo
        embeds: [embed_guild]
    })

    if (guild_warns[indice_warn].action) // Usuário recebeu a uma advertência com penalidade
        if (guild_warns[indice_warn].action !== "none") {

            const guild_member = await client.getMemberGuild(interaction.guild.id, id_alvo)
            const guild_executor = await client.getMemberGuild(interaction.guild.id, interaction.user.id)
            const bot_member = await client.getMemberGuild(interaction.guild.id, client.id())

            // Redirecionando o evento
            require(`../../../events/warn/${guild_warns[indice_warn].action.replace("_2", "")}`)({ client, user, interaction, guild, active_user_warns, user_warn, guild_member, guild_executor, bot_member })
        }

    if (guild_warns[indice_warn].role) { // Advertência atual acrescenta um cargo

        // Verificando permissões do bot no servidor
        if (await client.permissions(interaction, client.id(), [PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.Administrator])) {

            // Atribuindo o cargo ao usuário que recebeu a advertência
            let role = interaction.guild.roles.cache.get(guild_warns[indice_warn].role)

            if (role.editable) { // Verificando se o cargo é editável
                const membro_guild = await client.getMemberGuild(interaction, id_alvo)

                membro_guild.roles.add(role).catch(console.error)
            }
        } else
            client.notify(guild.warn.channel, { // Sem permissão para gerenciar cargos
                content: client.tls.phrase(guild, "mode.warn.sem_permissao_cargos", 7),
            })
    }

    return client.reply(interaction, {
        content: client.tls.phrase(user, "mode.warn.advertencia_registrada", 63),
        embeds: [],
        components: [],
        ephemeral: true
    })
}