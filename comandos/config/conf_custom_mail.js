const { SlashCommandBuilder, AttachmentBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('c_mail')
        .setDescription('⌠🤖⌡ Enviar mensagem em canal especifico')
        .addStringOption(option =>
            option.setName('texto')
                .setDescription("O texto a ser enviado")
                .setRequired(true))
        .addStringOption(option =>
            option.setName('canal')
                .setDescription("O canal alvo")
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('imagem')
                .setDescription("A imagem que será usada"))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute(client, interaction) {

        if (interaction.user.id !== client.owners[0]) return

        let entradas = interaction.options.data

        const corpo_mail = {
            texto: null,
            canal: null,
            anexo: null
        }

        entradas.forEach(valor => {
            if (valor.name === "texto")
                corpo_mail.texto = valor.value

            if (valor.name === "canal")
                corpo_mail.canal = valor.value

            if (valor.name === "imagem")
                corpo_mail.anexo = valor.attachment.attachment
        })

        let img_game
        const canal_alvo = await client.channels().get(corpo_mail.canal)

        if (canal_alvo.type === 0 || canal_alvo.type === 5) {
            if (canal_alvo.permissionsFor(client.user()).has(PermissionsBitField.Flags.ViewChannel) && canal_alvo.permissionsFor(client.user()).has(PermissionsBitField.Flags.SendMessages)) {
                if (corpo_mail.anexo) {
                    img_game = new AttachmentBuilder(corpo_mail.anexo)

                    canal_alvo.send({ content: corpo_mail.texto, files: [img_game] })
                } else
                    canal_alvo.send({ content: corpo_mail.texto })

                interaction.reply({ content: `:white_check_mark: | Mensagem enviada para o canal ${canal_alvo} com sucesso`, ephemeral: true })
            } else
                interaction.reply({ content: ":octagonal_sign: | Canal desconhecido", ephemeral: true })
        } else
            interaction.reply({ content: `:octagonal_sign: | O canal mencionado não é de texto, tente novamente`, ephemeral: true })
    }
}