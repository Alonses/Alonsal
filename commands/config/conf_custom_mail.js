const { SlashCommandBuilder, AttachmentBuilder, PermissionsBitField, PermissionFlagsBits, ChannelType } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("c_mail")
        .setDescription("⌠🤖⌡ Enviar mensagem em um canal especifico")
        .addStringOption(option =>
            option.setName("texto")
                .setDescription("O texto a ser enviado")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("canal")
                .setDescription("O canal alvo")
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName("imagem")
                .setDescription("A imagem que será usada"))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute({ client, user, interaction }) {

        if (interaction.user.id !== client.x.owners[0]) return

        const corpo_mail = {
            texto: interaction.options.getString("texto"),
            canal: interaction.options.getString("canal"),
            anexo: interaction.options.getAttachment("imagem")
        }

        const canal = await client.channels().get(corpo_mail.canal)

        if (canal.type === ChannelType.GuildText || canal.type === ChannelType.GuildAnnouncement) {
            if (await client.execute("permissions", { id_user: client.id(), permissions: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages], canal })) {
                if (corpo_mail.anexo) {
                    const img_anexo = new AttachmentBuilder(corpo_mail.anexo.attachment)

                    canal.send({
                        content: corpo_mail.texto,
                        files: [img_anexo]
                    })
                } else
                    canal.send({
                        content: corpo_mail.texto
                    })

                interaction.reply({
                    content: `:white_check_mark: | Mensagem enviada para o canal ${canal} com sucesso`,
                    flags: "Ephemeral"
                })
            } else
                interaction.reply({
                    content: ":octagonal_sign: | Canal desconhecido",
                    flags: "Ephemeral"
                })
        } else
            interaction.reply({
                content: ":octagonal_sign: | O canal mencionado não é de texto, tente novamente",
                flags: "Ephemeral"
            })
    }
}