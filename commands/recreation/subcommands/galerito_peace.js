module.exports = async ({ client, user, interaction, user_command }) => {

    interaction.reply({
        content: 'https://tenor.com/view/galerito-gil-das-esfihas-meme-br-slondo-gif-15414263',
        ephemeral: client.decider(user?.conf.ghost_mode || user_command, 0)
    })
}