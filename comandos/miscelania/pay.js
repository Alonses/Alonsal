const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pay")
        .setNameLocalizations({
            "pt-BR": 'dei-lhe',
            "es-ES": 'transferir',
            "fr": 'payer',
            "it": 'pagare',
            "ru": 'платить'
        })
        .setDescription("⌠💸⌡ Transfer Bufunfa to other users")
        .setDescriptionLocalizations({
            "pt-BR": '⌠💸⌡ Transfira Bufunfa para outros usuários',
            "es-ES": '⌠💸⌡ Transferir Bufunfa a otros usuarios',
            "fr": '⌠💸⌡ Transférer Bufunfa à d\'autres utilisateurs',
            "it": '⌠💸⌡ Trasferisci Bufunfa ad altri utenti',
            "ru": '⌠💸⌡ Делиться Bufunfa с другими пользователями'
        })
        .addUserOption(option =>
            option.setName("user")
                .setNameLocalizations({
                    "pt-BR": 'usuario',
                    "es-ES": 'usuario',
                    "it": 'utente',
                    "ru": 'пользователь'
                })
                .setDescription("The user who will receive")
                .setDescriptionLocalizations({
                    "pt-BR": 'O usuário que receberá',
                    "es-ES": 'El usuario que recibirá',
                    "fr": 'L\'utilisateur qui recevra',
                    "it": 'L\'utente che riceverà',
                    "ru": 'Пользователь, который получит'
                })
                .setRequired(true))
        .addNumberOption(option =>
            option.setName("amount")
                .setNameLocalizations({
                    "pt-BR": 'quantia',
                    "es-ES": 'monto',
                    "fr": 'montant',
                    "it": 'quantita',
                    "ru": 'ценить'
                })
                .setDescription("The amount that will be transferred")
                .setDescriptionLocalizations({
                    "pt-BR": 'A quantidade que será transferida',
                    "es-ES": 'El monto a transferir',
                    "fr": 'Le montant à transférer',
                    "it": 'L\'importo da trasferire',
                    "ru": 'Сумма к переводу'
                })
                .setRequired(true)),
    async execute(client, user, interaction) {

        let user_alvo = interaction.options.getUser("user")
        let bufunfas = interaction.options.getNumber("amount")

        if (bufunfas < 0.01)
            return client.tls.reply(interaction, user, "misc.pay.error_2", true, [9, 0])

        const alvo = await client.getUser(user_alvo.id)

        if (alvo.uid === user.uid)
            return client.tls.reply(interaction, user, "misc.pay.error_3", true, [9, 0])

        // Validando se o usuário marcado não é um bot
        const membro_sv = await client.getUserGuild(interaction, alvo.uid)

        if (!membro_sv) // Validando se o usuário marcado saiu do servidor
            return client.tls.reply(interaction, user, "mode.report.usuario_nao_encontrado", true, 1)

        if (membro_sv.user.bot && alvo.uid !== client.id())
            return client.tls.reply(interaction, user, "misc.pay.user_bot", true, [9, 0])

        if (user.misc.money < bufunfas) // Conferindo a quantidade de Bufunfas do pagador
            return client.tls.reply(interaction, user, "misc.pay.error", true, [9, 0], client.locale(bufunfas))

        const embed = new EmbedBuilder()
            .setTitle(client.tls.phrase(user, "misc.pay.nova_transferencia"))
            .setColor(client.embed_color(user.misc.color))
            .addFields(
                {
                    name: `**${client.defaultEmoji("money")} ${client.tls.phrase(user, "misc.pay.transferindo")}**`,
                    value: `\`B$ ${client.locale(bufunfas)}\``,
                    inline: true
                },
                {
                    name: `**${client.defaultEmoji("person")} ${client.tls.phrase(user, "misc.pay.destinatario")}**`,
                    value: `<@${alvo.uid}>`,
                    inline: true
                }
            )
            .setFooter({
                text: client.tls.phrase(user, "menu.botoes.selecionar_operacao"),
                iconURL: interaction.user.avatarURL({ dynamic: true })
            })

        // Criando os botões para o menu de transferências
        const row = client.create_buttons([
            { id: "transfer", name: client.tls.phrase(user, "menu.botoes.confirmar"), type: 2, data: `1|${alvo.uid}[${bufunfas}` },
            { id: "transfer", name: client.tls.phrase(user, "menu.botoes.cancelar"), type: 3, emoji: client.emoji(0), data: 0 }
        ], interaction)

        return interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        })
    }
}