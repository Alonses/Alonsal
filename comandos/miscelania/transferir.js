const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { emojis_dancantes } = require('../../arquivos/json/text/emojis.json')

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
        let bufunfas = interaction.options.data[1].value

        if (bufunfas < 0.01)
            return interaction.reply({ content: `:bank: :octagonal_sign: | ${client.tls.phrase(user, "misc.pay.error_2")}`, ephemeral: true })

        const alvo = await client.getUser(user_alvo.id)

        if (alvo.uid === user.uid)
            return interaction.reply({ content: `:bank: :octagonal_sign: | ${client.tls.phrase(user, "misc.pay.error_3")}`, ephemeral: true })

        // Validando se o usuário marcado não é um bot
        const membro_sv = await client.getUserGuild(interaction, alvo.uid)

        if (membro_sv.user.bot && alvo.uid !== client.id())
            return interaction.reply({ content: `:bank: :octagonal_sign: | ${client.tls.phrase(user, "misc.pay.user_bot")}`, ephemeral: true })

        formata_num = (valor) => valor.toLocaleString("pt-BR", { minimunFractionDigits: 2 })

        if (user.misc.money < bufunfas) // Conferindo a quantidade de Bufunfas do pagador
            return interaction.reply({ content: `:bank: :octagonal_sign: | ${client.tls.phrase(user, "misc.pay.error").replace("valor_repl", client.locale(bufunfas))}`, ephemeral: true })

        const embed = new EmbedBuilder()
            .setTitle("> Nova transferência")
            .setColor(client.embed_color(user.misc.color))
            .addFields(
                {
                    name: `**${client.defaultEmoji("money")} Transferindo**`,
                    value: `\`B$ ${formata_num(bufunfas)}\``,
                    inline: true
                },
                {
                    name: `**${client.defaultEmoji("person")} Destinatário**`,
                    value: `<@${alvo.uid}>`,
                    inline: true
                }
            )
            .setFooter({ text: "Selecione a operação desejada nos botões abaixo.", iconURL: interaction.user.avatarURL({ dynamic: true }) })

        // Criando os botões para o menu de transferências
        const row = client.create_buttons([{ name: `Confirmar:transfer.${alvo.uid}[${bufunfas}]`, value: '1', type: 2 }, { name: 'Cancelar:transfer', value: '0', type: 3 }], interaction)

        return interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
    }
}