const { listAllGuildWarns } = require('../../../database/schemas/Guild_warns')
const { listAllUserPreWarns, listAllCachedUserPreWarns } = require('../../../database/schemas/User_pre_warns')
const { listAllUserWarns, getUserWarn, listAllUserCachedHierarchyWarns } = require('../../../database/schemas/User_warns')

const { atualiza_pre_warns } = require('../../../auto/triggers/guild_pre_warns')

const { defaultEraser, spamTimeoutMap } = require('../../../formatters/patterns/timeout')

module.exports = async ({ client, user, interaction, dados }) => {

    const id_alvo = dados.split(".")[2]
    const id_executor = interaction.user.id
    const operacao = parseInt(dados.split(".")[1])

    // Rascunhos de anotações de advertência salvas em cache
    let user_notes = await listAllCachedUserPreWarns(client.encrypt(id_alvo), client.encrypt(interaction.guild.id))

    if (operacao === 0) { // Operação cancelada

        // Excluindo a última anotação de advertência registrada em cache
        user_notes[user_notes.length - 1].delete()

        return client.reply(interaction, {
            content: client.tls.phrase(user, "mode.warn.advertencia_cancelada", client.emoji(0)),
            embeds: [],
            components: [],
            flags: "Ephemeral"
        })
    }

    // Advertência confirmada
    const guild = await client.getGuild(interaction.guild.id)
    const user_note = user_notes[user_notes.length - 1]

    // Validando a advertência
    user_note.valid = true
    await user_note.save()

    // Atualizando a lista de anotações criadas
    if (guild.warn.hierarchy.timed) atualiza_pre_warns()

    const notas_recebidas = await listAllUserPreWarns(client.encrypt(id_alvo), client.encrypt(interaction.guild.id))

    // Verificando se o membro já ultrapassou o número de anotações necessárias para cada advertência 
    const guild_warns = await listAllGuildWarns(client.encrypt(interaction.guild.id))
    const user_warns = await listAllUserWarns(client.encrypt(id_alvo, interaction.guild.id))

    let indice_warn = user_warns.length > guild_warns.length ? user_warns.length - 1 : user_warns.length
    if (indice_warn < 1) indice_warn = 0

    const notas_requeridas = guild_warns[indice_warn].strikes !== 0 ? guild_warns[indice_warn].strikes : guild.warn.hierarchy.strikes

    // Embed de aviso para o servidor onde foi aplicada a advertência
    const embed_guild = client.create_embed({
        title: `${!guild.warn.hierarchy.status ? client.tls.phrase(guild, "mode.warn.titulo_advertencia") : client.tls.phrase(guild, "mode.anotacoes.titulo_nova_anotacao")} :inbox_tray:`,
        color: "salmao",
        description: `${client.tls.phrase(guild, "mode.warn.usuario_nova_advertencia")}!\n\`\`\`fix\n📠 | ${client.tls.phrase(guild, "mode.warn.descricao_fornecida")}\n\n${client.decifer(user_note.relatory)}\`\`\``,
        fields: [
            {
                name: `:bust_in_silhouette: **${client.tls.phrase(guild, "mode.report.usuario")}**`,
                value: `${client.emoji("icon_id")} \`${id_alvo}\`\n${client.emoji("mc_name_tag")} \`${client.decifer(user_note.nick)}\`\n( <@${id_alvo}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("guard")} **${client.tls.phrase(guild, "mode.warn.moderador_responsavel")}**`,
                value: `${client.emoji("icon_id")} \`${id_executor}\`\n${client.emoji("mc_name_tag")} \`${interaction.user.username}\`\n( <@${id_executor}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("pen")} **${notas_recebidas.length > 0 ? `${notas_recebidas.length} / ${notas_requeridas} ${client.tls.phrase(guild, "menu.botoes.anotacoes")}` : client.tls.phrase(guild, "mode.anotacoes.sem_anotacoes")}**`,
                value: "⠀",
                inline: true
            }
        ],
        timestamp: true
    })

    // Anotação de advertência com prazo de expiração
    if (guild.warn.hierarchy.timed)
        embed_guild
            .addFields({
                name: `${client.defaultEmoji("time")} **${client.tls.phrase(guild, "menu.botoes.expiracao")}**`,
                value: `**${client.tls.phrase(guild, "mode.warn.remocao_em")} \`${client.tls.phrase(guild, `menu.times.${defaultEraser[guild.warn.hierarchy.reset]}`)}\`**\n( <t:${client.timestamp() + defaultEraser[guild.warn.hierarchy.reset]}:f> )`,
                inline: false
            })
            .setFooter({
                text: client.tls.phrase(guild, "mode.warn.dica_expiracao_rodape"),
                iconURL: interaction.user.avatarURL({ dynamic: true })
            })

    // Altera o destino para o canal de avisos temporários
    if (guild.warn.timed_channel) interaction.channel.id = guild.warn.timed_channel

    // Envia uma mensagem temporária no canal onde foi gerada a anotação de advertência
    client.timed_message(interaction, { content: client.tls.phrase(guild, "mode.anotacoes.ping_anotacao", [id_alvo, notas_recebidas.length, notas_recebidas, client.timestamp() + 60]) }, 60)
    client.notify(guild.warn.hierarchy.channel, { embeds: [embed_guild] })

    client.reply(interaction, {
        content: client.tls.phrase(user, "mode.warn.advertencia_registrada", 63),
        embeds: [],
        components: [],
        flags: "Ephemeral"
    })

    // Verificando se há cards aguardando aprovação já enviados
    if ((await listAllUserCachedHierarchyWarns(id_alvo, interaction.guild.id)).length > 0) return

    if (notas_recebidas.length >= notas_requeridas) {

        // Criando um card de advertência hierárquica ao membro
        const hierarchy_warn = await getUserWarn(client.encrypt(id_alvo), client.encrypt(interaction.guild.id), client.timestamp())

        hierarchy_warn.hierarchy = true
        hierarchy_warn.save()

        const embed = client.create_embed({
            title: { tls: "mode.anotacoes.aplicar_advertencia" },
            color: "salmao",
            description: { tls: "mode.anotacoes.descricao_advertencia", emoji: client.defaultEmoji("guard"), replace: [notas_requeridas, user_warns.length + 1] },
            fields: [
                {
                    name: `:bust_in_silhouette: **${client.tls.phrase(guild, "mode.report.usuario")}**`,
                    value: `${client.emoji("icon_id")} \`${id_alvo}\`\n${client.emoji("mc_name_tag")} \`${client.decifer(user_note.nick)}\`\n( <@${id_alvo}> )`,
                    inline: true
                },
                {
                    name: `${client.defaultEmoji("time")} **${client.tls.phrase(guild, "menu.botoes.expiracao")}**`,
                    value: `**${client.tls.phrase(guild, "mode.warn.remocao_em")} \`${client.tls.phrase(guild, `menu.times.${spamTimeoutMap[guild.warn.reset]}`)}\`**`,
                    inline: true
                },
                {
                    name: `${client.emoji("banidos")} **${client.tls.phrase(guild, "menu.botoes.penalidade")}**`,
                    value: client.verifyAction(guild_warns[indice_warn], guild),
                    inline: true
                }
            ],
            timestamp: true
        }, guild)

        const rows = [
            { id: "warn_activate", name: { tls: "menu.botoes.conceder_advertencia" }, type: 2, emoji: client.emoji(10), data: `1|${id_alvo}.${indice_warn}` },
            { id: "warn_activate", name: { tls: "menu.botoes.cancelar_advertencia" }, type: 3, emoji: client.emoji(0), data: `2|${id_alvo}.${indice_warn}` }
        ]

        // Enviando o card para os moderadores poderem autorizar a aplicação da advertência
        client.notify(guild.warn.hierarchy.channel, { embeds: [embed], components: [client.create_buttons(rows, interaction, guild)] })
    }
}