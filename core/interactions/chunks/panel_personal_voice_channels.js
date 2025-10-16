const { verifyUserParty } = require("../../database/schemas/User_voice_channel_party")

module.exports = async ({ client, user, interaction, partyLotada }) => {

    // Coletando dados da party do membro no servidor
    const guild = await client.getGuild(interaction.guild.id)
    const userParty = await verifyUserParty(user.uid, client.encrypt(interaction.guild.id), user?.misc.voice_channels.global_config)
    let descricao = guild?.voice_channels.preferences.allow_preferences ? client.tls.phrase(user, "mode.voice_channels.custom_on") : client.tls.phrase(user, "mode.voice_channels.custom_off")

    if (userParty.length > 0) { // Listando todos os membros permitidos a acessar o canal privado
        descricao += `\n:passport_control: **${client.tls.phrase(user, "mode.voice_channels.usuarios_autorizados")} (${userParty.length} ${user.misc.voice_channels.global_config ? "/ 🔀 🌐" : `/ ${client.cached.subscribers.has(user.uid) ? 30 : 10}`}):**\n`
        let users_permitidos = []

        userParty.forEach(user => {
            users_permitidos.push(`<@${client.decifer(user.mid)}>`)
        })

        descricao += client.execute("list", { valores: users_permitidos, raw: true })
    }

    const embed = client.create_embed({
        title: `> ${client.tls.phrase(user, "mode.voice_channels.title_voice")} 🔊`,
        description: { tls: "mode.voice_channels.descricao_edicao_canais_user", replace: descricao },
        fields: [
            {
                name: `${client.execute("button_emoji", user?.misc.voice_channels.always_private)} ${client.tls.phrase(user, "menu.botoes.canal_privado")}\n${user?.misc.voice_channels.user_limit < 1 ? "🗽" : "🚧"} ${client.tls.phrase(user, "mode.voice_channels.limite_usuarios")} `,
                value: user.misc.voice_channels.user_limit < 1 ? `\`${client.tls.phrase(user, "util.canal.sem_limite")}\`` : `\`${user.misc.voice_channels.user_limit} ${client.tls.phrase(user, "mode.voice_channels.usuarios")}\``,
                inline: true
            },
            {
                name: `${client.execute("button_emoji", user.misc.voice_channels.global_config)} ${client.tls.phrase(user, "menu.botoes.global")}`,
                value: "⠀",
                inline: true
            }
        ],
        footer: {
            text: "⠀",
            iconURL: interaction.user.avatarURL({ dynamic: true })
        }
    }, user)

    const botoes = [
        { id: "user_voice_channels_preferences", name: { tls: "menu.botoes.canal_privado" }, type: user?.misc.voice_channels.always_private, emoji: client.emoji(18), data: "2" },
        { id: "user_voice_channels_preferences", name: { tls: "mode.voice_channels.usuarios_autorizados" }, type: 0, emoji: client.emoji(7), data: "1" },
        { id: "user_voice_channels_preferences", name: { tls: "menu.botoes.global" }, type: user?.misc.voice_channels.global_config, emoji: client.emoji(32), data: "8" }
    ]

    const row = [
        { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: "panel_personal.1" },
        { id: "user_voice_channels_preferences", name: { tls: "mode.voice_channels.limite_usuarios" }, type: 0, emoji: user.misc.voice_channels.user_limit < 1 ? "🗽" : "🚧", data: "3" }
    ]

    if (userParty?.length > 0) // Verificando se há mais membros autorizados a acessar o canal pré-configurado
        row.push({ id: "user_voice_channels_preferences", name: { tls: "menu.botoes.limpar_membros" }, type: 0, emoji: client.emoji(62), data: "4" })

    client.reply(interaction, {
        content: partyLotada?.length > 0 ? client.tls.phrase(user, "mode.voice_channels.limite_usuarios_autorizados", 75, client.execute("list", { valores: partyLotada, raw: true })) : "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction, user), client.create_buttons(row, interaction, user)],
        flags: "Ephemeral"
    })
}