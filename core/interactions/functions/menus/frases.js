const { AttachmentBuilder } = require('discord.js')

module.exports = async ({ client, user, interaction, dados, autor_original }) => {

    const nome = dados.split("|")[0]
    const escolha = dados.split(".")[1]

    // Enviando uma das frases de memes selecionadas pelo menu
    const file = new AttachmentBuilder(`./files/songs/${nome}/${nome}_${escolha}.ogg`, { name: `${nome}.ogg` })

    if (autor_original)
        interaction.update({
            content: "",
            files: [file],
            components: [],
            ephemeral: client.decider(user?.conf.ghost_mode, 0)
        })
    else
        interaction.reply({
            content: "",
            files: [file],
            components: [],
            ephemeral: false
        })
}