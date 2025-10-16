const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, ChannelType } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("c_send_vote")
        .setDescription("⌠🤖⌡ Envie o embed de votação em algum servidor!")
        .addStringOption(option =>
            option.setName("canal")
                .setDescription("O canal que será enviado")
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute({ client, user, interaction }) {

        if (!client.x.owners.includes(interaction.user.id)) return

        const id_canal = interaction.options.getString("canal")
        const canal = client.discord.channels.cache.get(id_canal)

        const embed = client.create_embed({
            title: `${client.tls.phrase(user, "inic.vote.titulo")} ${client.emoji("emojis_dancantes")}`,
            color: "turquesa",
            description: `${client.tls.phrase(user, "inic.vote.descricao", [client.emoji("emojis_dancantes"), client.emoji("emojis_dancantes")])} <t:1692460800:f>!\n\n:flag_de: :flag_nl: :flag_se: :flag_tr: :flag_jp: :flag_de: :flag_nl: :flag_se: :flag_tr: :flag_jp:\n:flag_nl: :flag_se: :flag_tr: :flag_jp: :flag_de: :flag_nl: :flag_se: :flag_tr: :flag_jp: :flag_de:\n:flag_se: :flag_tr: :flag_jp: :flag_de: :flag_nl: :flag_se: :flag_tr: :flag_jp: :flag_de: :flag_nl:`,
            footer: {
                text: { tls: "inic.vote.rodape" }
            }
        }, user)

        const row = client.create_buttons([
            { id: "vote_button", name: 'Deutsch', emoji: "🇩🇪", type: 0, data: "de" },
            { id: "vote_button", name: 'Nederlands', emoji: "🇳🇱", type: 0, data: "nl" },
            { id: "vote_button", name: 'Svenska', emoji: "🇸🇪", type: 0, data: "se" },
            { id: "vote_button", name: 'Türkçe', emoji: "🇹🇷", type: 0, data: "tr" },
            { id: "vote_button", name: '日本語', emoji: "🇯🇵", type: 0, data: "jp" }
        ], interaction)

        if (canal) {
            // Enviando os anúncios para os canais
            if (canal.type === ChannelType.GuildText || canal.type === ChannelType.GuildAnnouncement) {

                // Permissão para enviar mensagens no canal
                if (await client.execute("permissions", { id_user: client.id(), permissions: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel], canal })) {
                    interaction.reply({
                        content: `:mailbox: | O embed de votação foi enviado ao canal <#${id_canal}> com sucesso!`,
                        flags: "Ephemeral"
                    })

                    client.execute("notify", { id_canal: id_canal, conteudo: { embeds: [embed], components: [row] } })
                } else
                    interaction.reply({
                        content: `${client.defaultEmoji("guard")} | Eu não posso enviar mensagens nesse canal ( <#${id_canal}> ) por falta de permissões.`,
                        flags: "Ephemeral"
                    })
            } else
                interaction.reply({
                    content: ":o: | O tipo do canal definido não é de texto, por favor tente novamente",
                    flags: "Ephemeral"
                })
        } else
            interaction.reply({
                content: ":mag: | O canal mencionado não existe.",
                flags: "Ephemeral"
            })
    }
}