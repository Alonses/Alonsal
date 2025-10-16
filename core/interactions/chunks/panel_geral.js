module.exports = async ({ client, user, interaction }) => {

    const embed = client.create_embed({
        title: "> Painel de controle do Alonsal",
        color: "turquesa",
        footer: {
            text: "Selecione uma das opções abaixo para navegar",
            iconURL: interaction.user.avatarURL({ dynamic: true })
        }
    })

    const row = client.create_buttons([
        { id: "internal_conf_panel", name: "Informações", type: 0, emoji: client.defaultEmoji("paper"), data: "0" },
        { id: "internal_conf_panel", name: "Funções", type: 0, emoji: client.emoji("icon_slash_commands"), data: "1" },
        { id: "internal_conf_panel", name: "Status", type: 0, emoji: client.defaultEmoji("channel"), data: "2" }
    ], interaction)

    client.reply(interaction, {
        content: '',
        embeds: [embed],
        components: [row],
        flags: "Ephemeral"
    })
}