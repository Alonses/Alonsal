const { EmbedBuilder } = require('discord.js')

module.exports = async ({ client, guild, registroAudita, dados }) => {

    let texto, cargos = []
    const user_alvo = dados[0].user, old_member = dados[0], new_member = dados[1]

    // Listando a alteração de cargo
    registroAudita.changes[0].new.forEach(role => { cargos.push(`<@&${role.id}>`) })

    if (registroAudita.changes[0].key === "$add")
        texto = `\n**:sparkle: ${client.tls.phrase(guild, "mode.logger.cargo_adicionado")}:** ${cargos.join(", ")}`
    else
        texto = `\n**:no_entry_sign: ${client.tls.phrase(guild, "mode.logger.cargo_removido")}:** ${cargos.join(", ")}`

    let embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.logger.cargo_atualizado"))
        .setColor(client.embed_color("turquesa"))
        .setDescription(texto)
        .setFields(
            {
                name: client.user_title(user_alvo, guild, "util.server.membro"),
                value: `${client.emoji("icon_id")} \`${user_alvo.id}\`\n${client.emoji("mc_name_tag")} \`${user_alvo.username}\`\n( <@${user_alvo.id}> )`,
                inline: true
            },
            {
                name: client.user_title(registroAudita.executor, guild, "mode.logger.autor", client.defaultEmoji("guard")),
                value: `${client.emoji("icon_id")} \`${registroAudita.executorId}\`\n${client.emoji("mc_name_tag")} \`${registroAudita.executor.username}\`\n( <@${registroAudita.executorId}> )`,
                inline: true
            }
        )
        .setTimestamp()

    // Comparando as permissões adicionadas e removidas
    const alteracoes = comparar_diferencas(old_member.permissions.toArray(), new_member.permissions.toArray())

    // Data de entrada do membro no servidor
    const user_guild = new_member
    embed = client.execute("formatters", "formata_entrada_membro", { client, guild, user_guild, embed })

    // Listando as permissões do usuário
    embed.addFields(
        {
            name: `:shield: **${client.tls.phrase(guild, "mode.logger.permissoes_apos")}**`,
            value: alteracoes.adicoes.length > 0 || alteracoes.remocoes.length > 0 ? `${alteracoes.adicoes.length > 0 ? `**🌟 ${client.tls.phrase(guild, "mode.logger.cargo_adicionado")}:**\n${client.list(alteracoes.adicoes, 2000)}\n` : ""}${alteracoes.remocoes.length > 0 ? `**\n❌ ${client.tls.phrase(guild, "mode.logger.cargo_removido")}:**\n${client.list(alteracoes.remocoes, 2000)}` : ""}` : `\`❌ ${client.tls.phrase(guild, "mode.logger.sem_permissoes_vinculadas")}\``,
            inline: false
        }
    )

    const url_avatar = user_alvo.avatarURL({ dynamic: true, size: 2048 })
    if (url_avatar) embed.setThumbnail(url_avatar)

    client.notify(guild.logger.channel, { embeds: [embed] })
}

function comparar_diferencas(antigo, novo) {

    const obj = {
        adicoes: [],
        remocoes: []
    }

    // Comparando as adições e remoções ao atribuir/remover cargos
    for (let i = 0; i < antigo.length; i++)
        for (let x = 0; x < novo.length; x++) {

            if (!antigo.includes(novo[x]) && !obj.adicoes.includes(novo[x]) && novo[x])
                obj.adicoes.push(novo[x])
            else if (!novo.includes(antigo[x]) && !obj.remocoes.includes(antigo[x]) && antigo[x])
                obj.remocoes.push(antigo[x])
        }

    return obj
}