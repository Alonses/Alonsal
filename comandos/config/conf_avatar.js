const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('c_avatar')
        .setDescription('⌠🤖⌡ Altere o avatar do Alonsal')
        .addAttachmentOption(option =>
            option.setName('foto')
                .setDescription('A nova foto para o bot')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute(client, interaction) {

        if (!client.owners.includes(interaction.user.id)) return

        novo_perfil = interaction.options.data[0].attachment.attachment

        if (!novo_perfil.includes(".png") && !novo_perfil.includes(".jpg") && !novo_perfil.includes(".jpeg") && !novo_perfil.includes(".bmp"))
            return interaction.reply(":octagonal_sign: | Envie um link/arquivo diferente de gif")

        const att_avatar = new EmbedBuilder()
            .setTitle(`:bust_in_silhouette: O Avatar do ${client.user().username} foi alterado`)
            .setColor(0x29BB8E)
            .setImage(novo_perfil)
            .setDescription(`**Alterado por** ( \`${interaction.user.username}\` | \`${interaction.user.id}\` )`)

        await client.user().setAvatar(novo_perfil)

        interaction.reply({ content: ":bust_in_silhouette: | Avatar enceirado atualizado", ephemeral: true });
        client.notify(process.env.feeds_channel, 1, att_avatar);
    }
}