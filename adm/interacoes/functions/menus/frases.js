const { AttachmentBuilder } = require('discord.js')

module.exports = async ({ client, user, interaction, dados }) => {

    const nome = dados.split("|")[0]
    const escolha = dados.split(".")[1]

    // Enviando uma das frases de memes selecionadas pelo menu
    const file = new AttachmentBuilder(`./arquivos/songs/${nome}/${nome}_${escolha}.ogg`, { name: `${nome}.ogg` })

    interaction.update({ content: "", files: [file], components: [], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
}