const { SlashCommandBuilder } = require('discord.js')

const { emojis_dancantes } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setNameLocalizations({
            "pt-BR": 'dei-lhe',
            "es-ES": 'transferir',
            "fr": 'payer',
            "it": 'pagare'
        })
        .setDescription('⌠💸⌡ Transfer Bufunfa to other users')
        .setDescriptionLocalizations({
            "pt-BR": '⌠💸⌡ Transfira Bufunfa para outros usuários',
            "es-ES": '⌠💸⌡ Transferir Bufunfa a otros usuarios',
            "fr": '⌠💸⌡ Transférer Bufunfa à d\'autres utilisateurs',
            "it": '⌠💸⌡ Trasferisci Bufunfa ad altri utenti'
        })
        .addUserOption(option =>
            option.setName('user')
                .setNameLocalizations({
                    "pt-BR": 'usuario',
                    "es-ES": 'usuario',
                    "it": 'utente'
                })
                .setDescription('The user who will receive')
                .setDescriptionLocalizations({
                    "pt-BR": 'O usuário que receberá',
                    "es-ES": 'El usuario que recibirá',
                    "fr": 'L\'utilisateur qui recevra',
                    "it": 'L\'utente che riceverà'
                })
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('amount')
                .setNameLocalizations({
                    "pt-BR": 'quantia',
                    "es-ES": 'monto',
                    "fr": 'montant',
                    "it": 'quantita'
                })
                .setDescription('The amount that will be transferred')
                .setDescriptionLocalizations({
                    "pt-BR": 'A quantidade que será transferida',
                    "es-ES": 'El monto a transferir',
                    "fr": 'Le montant à transférer',
                    "it": 'L\'importo da trasferire'
                })
                .setRequired(true)),
    async execute(client, interaction) {

        let user_alvo = interaction.options.getUser('user')
        let bufunfas = interaction.options.data[1].value

        if (bufunfas < 0.01)
            return interaction.reply({ content: `:bank: :octagonal_sign: | ${client.tls.phrase(client, interaction, "misc.pay.error_2")}`, ephemeral: true })

        const user = await client.getUser(interaction.user.id), alvo = await client.getUser(user_alvo.id)

        if (alvo.uid === user.uid)
            return interaction.reply({ content: `:bank: :octagonal_sign: | ${client.tls.phrase(client, interaction, "misc.pay.error_3")}`, ephemeral: true })

        // Validando se o usuário marcado não é um bot
        const membro_sv = await interaction.guild.members.cache.get(alvo.uid)

        if (membro_sv.user.bot && alvo.uid !== client.id())
            return interaction.reply({ content: `:bank: :octagonal_sign: | ${client.tls.phrase(client, interaction, "misc.pay.user_bot")}`, ephemeral: true })

        formata_num = (valor) => valor.toLocaleString("pt-BR", { minimunFractionDigits: 2 })

        if (user.misc.money < bufunfas) // Conferindo a quantidade de Bufunfas do pagador
            return interaction.reply({ content: `:bank: :octagonal_sign: | ${client.tls.phrase(client, interaction, "misc.pay.error").replace("valor_repl", client.formata_num(bufunfas))}`, ephemeral: true })

        user.misc.money -= bufunfas
        alvo.misc.money += bufunfas

        user.save()
        alvo.save()

        const caso = "movimentacao", quantia = bufunfas
        require('../../adm/automaticos/relatorio.js')({ client, caso, quantia })

        if (alvo.uid === client.id() && quantia === 24.69) // Funny Number
            require('../../adm/data/conquistas')(client, 1, interaction.user.id, interaction)

        interaction.reply({ content: `:bank: :white_check_mark: | ${client.tls.phrase(client, interaction, "misc.pay.sucesso").replace("valor_repl", client.formata_num(bufunfas))} <@!${alvo.uid}>`, ephemeral: true })

        if (alvo.uid !== client.id()) // Notificando o recebedor
            client.discord.users.fetch(alvo.uid, false).then((user_interno) => {

                // Enviando a mensagem no idioma do usuário alvo
                user_interno.send(`:bank: | ${client.tls.phrase(client, alvo.uid, "misc.pay.notifica").replace("user_repl", user.uid).replace("valor_repl", client.formata_num(bufunfas))} ${client.emoji(emojis_dancantes)}`)
            })
    }
}