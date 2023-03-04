const { SlashCommandBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nickname")
        .setNameLocalizations({
            "pt-BR": 'apelido',
            "es-ES": 'apellido',
            "ru": 'прозвище'
        })
        .setDescription("⌠😂⌡ Shuffles your nickname!")
        .setDescriptionLocalizations({
            "pt-BR": '⌠😂⌡ Embaralha seu apelido!',
            "es-ES": '⌠😂⌡ Mezcla tu apodo!',
            "fr": '⌠😂⌡ Mélangez votre pseudo!',
            "it": '⌠😂⌡ Mescola il tuo soprannome!',
            "ru": '⌠😂⌡ Перемешайте свой никнейм!'
        }),
    async execute(client, user, interaction) {

        if (interaction.guild.ownerId === interaction.user.id)
            return client.tls.reply(interaction, user, "dive.nick.permissao_1", true, 0)

        // Permissões do bot no servidor
        const membro_sv = await interaction.guild.members.cache.get(client.id())

        // Libera configuração apenas se puder editar o apelido de outros usuários
        if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageNicknames) || !membro_sv.permissions.has(PermissionsBitField.Flags.ChangeNickname))
            return client.tls.reply(interaction, user, "dive.nick.permissao_2", true, 0)

        const user_alvo = await interaction.guild.members.fetch(interaction.user.id)

        let apelido = user_alvo.nickname || user_alvo.user.username

        user_alvo.setNickname(client.shuffleArray(apelido.split("").join("").trim()))
            .then(() => {
                interaction.reply({ content: client.tls.phrase(user, "dive.nick.apelido").replace("apelido_repl", apelido), ephemeral: user?.conf.ghost_mode || false })
            })
            .catch(err => {
                console.log(err)
                client.tls.reply(interaction, user, "dive.nick.error_1", true, 0)
            })
    }
}