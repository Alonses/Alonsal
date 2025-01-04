const { AttachmentBuilder } = require('discord.js')

module.exports = async ({ client, user, interaction, dados, autor_original, user_command }) => {

    const nome = dados.split("|")[0]
    const escolha = dados.split(".")[1]

    // Enviando uma das frases de memes selecionadas pelo menu
    const file = new AttachmentBuilder(`./files/songs/${nome}/${nome}_${escolha}.ogg`, { name: `${nome}.ogg` })

    if (!autor_original) interaction.customId = null

    client.reply(interaction, {
        content: "",
        files: [file],
        components: [],
        flags: user_command ? "Ephemeral" : autor_original ? client.decider(user?.conf.ghost_mode, 0) ? "Ephemeral" : null : null
    })
}