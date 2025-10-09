const { getGuildVoiceTrigger, listAllGuildVoiceTriggers, verifyTwinTriggers } = require("../../database/schemas/Voice_triggers")

const { voice_names } = require("../../formatters/patterns/guild")

module.exports = async ({ client, user, interaction, dados }) => {

    const hash_trigger = dados.split(".")[2]
    const trigger = await getGuildVoiceTrigger(client, client.encrypt(interaction.guild.id), hash_trigger)
    const ativadores_semelhantes = (await verifyTwinTriggers(client.encrypt(interaction.guild.id), trigger.config.channel)).length

    if (trigger.config.category && !trigger.config.category_nick) {

        // Atualizando o trigger com o nome da categoria ao ser editado caso não possua
        const canal = await client.getGuildChannel(client.decifer(trigger.config.category))
        trigger.config.category_nick = client.encrypt(canal?.name || client.tls.phrase(user, "util.steam.undefined"))

        await trigger.save()
    }

    const embed = client.create_embed({
        title: `> ${client.tls.phrase(user, "mode.voice_channels.title_trigger")} 🔊`,
        description: { tls: "mode.voice_channels.descricao_trigger", replace: ativadores_semelhantes > 1 ? client.tls.phrase(user, "mode.voice_channels.ativadores_duplicados") : "" },
        fields: [
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", trigger?.config.preferences.always_private)} ${client.tls.phrase(user, "menu.botoes.sempre_privado")}\n${trigger?.config.preferences.user_limit < 1 ? "🗽" : "🚧"} ${client.tls.phrase(user, "mode.voice_channels.limite_usuarios")}`,
                value: trigger?.config.preferences.user_limit < 1 ? `\`${client.tls.phrase(user, "util.canal.sem_limite")}\`` : `\`${trigger?.config.preferences.user_limit} ${client.tls.phrase(user, "mode.voice_channels.usuarios")}\``,
                inline: true
            },
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", trigger?.config.preferences.allow_text)} ${client.tls.phrase(user, "menu.botoes.permitir_texto")}\n${client.emoji("mc_name_tag")} ${client.tls.phrase(user, "mode.voice_channels.temas_nomes")}`,
                value: `\`${voice_names[trigger?.config.preferences.voice_names]} ${client.tls.phrase(user, `mode.voice_channels.nicknames.${trigger?.config.preferences.voice_names}`)}\``,
                inline: true
            },
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", trigger.config.active)} \`${client.tls.phrase(user, trigger.config.active ? "mode.voice_channels.habilitado" : "mode.voice_channels.desligado")}\``,
                value: "⠀",
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "mode.voice_channels.canal_ativador")}**`,
                value: `${trigger.config.channel ? `${client.emoji("icon_id")} \`${client.decifer(trigger.config.channel)}\`\n( <#${client.decifer(trigger.config.channel)}> )` : `\`❌ ${client.tls.phrase(user, "mode.network.sem_canal")}\``}`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "util.server.categoria")}**`,
                value: `${client.emoji("icon_id")} \`${client.decifer(trigger.config.category)}\`\n( <#${client.decifer(trigger.config.category)}> )`,
                inline: true
            }
        ],
        footer: {
            text: "⠀",
            iconURL: interaction.user.avatarURL({ dynamic: true })
        }
    }, user)

    const botoes = [
        { id: "voice_trigger_configure_button", name: { tls: "menu.botoes.sempre_privado" }, type: client.execute("functions", "emoji_button.type_button", trigger?.config.preferences.always_private), emoji: client.emoji(18), data: `22.${hash_trigger}` },
        { id: "voice_trigger_configure_button", name: { tls: "mode.voice_channels.limite_usuarios" }, type: 1, emoji: trigger?.config.preferences.user_limit < 1 ? "🗽" : "🚧", data: `21.${hash_trigger}` },
        { id: "voice_trigger_configure_button", name: { tls: "menu.botoes.permitir_texto" }, type: client.execute("functions", "emoji_button.type_button", trigger?.config.preferences.allow_text), emoji: client.emoji(31), data: `24.${hash_trigger}` },
        { id: "voice_trigger_configure_button", name: { tls: "menu.botoes.nomes" }, type: 1, emoji: client.emoji("mc_name_tag"), data: `23.${hash_trigger}` }
    ]

    const row = [
        { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 0, emoji: client.emoji(19), data: "guild_voice_channels_button.30" },
        { id: "voice_trigger_configure_button", name: { tls: trigger.config.active ? "menu.botoes.desativar" : "menu.botoes.ativar" }, type: client.execute("functions", "emoji_button.type_button", trigger.config.active), emoji: client.emoji(trigger.config.active ? "mc_oppose" : "mc_approve"), data: `1.${hash_trigger}` },
        { id: "voice_trigger_configure_button", name: { tls: "mode.voice_channels.canal_ativador" }, type: 1, emoji: client.defaultEmoji("channel"), data: `2.${hash_trigger}` },
        { id: "voice_trigger_configure_button", name: { tls: "util.server.categoria" }, type: 1, emoji: client.defaultEmoji("channel"), data: `3.${hash_trigger}` }
    ]

    if ((await listAllGuildVoiceTriggers(client.encrypt(interaction.guild.id))).length > 1)
        row.push({ id: "voice_trigger_configure_button", name: { tls: "menu.botoes.apagar" }, type: 3, emoji: client.emoji(13), data: `25.${hash_trigger}` })

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction, user), client.create_buttons(row, interaction, user)],
        flags: "Ephemeral"
    })
}