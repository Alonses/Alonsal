const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("c_avatar")
        .setDescription("⌠🤖⌡ Alterar o avatar do Alonsal")
        .addAttachmentOption(option =>
            option.setName("foto")
                .setDescription("A nova foto de perfil do bot")
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute({ client, user, interaction }) {

        if (!client.x.owners.includes(interaction.user.id)) return

        let arquivo = interaction.options.getAttachment("foto")

        if (!arquivo.contentType.includes("image/"))
            return interaction.reply(":octagonal_sign: | Envie um arquivo de imagem!")

        const embed = client.create_embed({
            title: `:bust_in_silhouette: O Avatar do ${client.username()} foi alterado`,
            color: "turquesa",
            image: arquivo.attachment,
            description: `**Alterado por** ( \`${interaction.user.username}\` | \`${interaction.user.id}\` )`
        })

        await client.user().setAvatar(arquivo.attachment)

        interaction.reply({
            content: ":bust_in_silhouette: | Avatar do bot atualizado",
            flags: "Ephemeral"
        })

        client.execute("notify", { id_canal: process.env.channel_feeds, conteudo: { embeds: [embed] } })
    }
}