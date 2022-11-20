const { SlashCommandBuilder } = require('discord.js')
const { getUser } = require("../../adm/database/schemas/User.js");

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

        let { customizacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)

        let user_alvo = interaction.options.getUser('user')
        let bufunfas = interaction.options.data[1].value

        if (bufunfas < 0.01)
            return interaction.reply({ content: `:bank: :octagonal_sign: | ${client.tls.phrase(client, interaction, "misc.pay.error_2")}`, ephemeral: true })

        const user = await getUser(interaction.user.id), alvo = await getUser(user_alvo.id)

        if (alvo.id === user.id)
            return interaction.reply({ content: `:bank: :octagonal_sign: | ${client.tls.phrase(client, interaction, "misc.pay.error_3")}`, ephemeral: true })

        // Validando se o usuário marcado não é um bot
        const membro_sv = interaction.guild.members.cache.get(alvo.id)

        if (membro_sv.user.bot && alvo.id !== client.id())
            return interaction.reply({ content: `:bank: :octagonal_sign: | ${client.tls.phrase(client, interaction, "misc.pay.user_bot")}`, ephemeral: true })

        formata_num = (valor) => valor.toLocaleString("pt-BR", { minimunFractionDigits: 2 })

        if (user.misc.money < bufunfas) // Conferindo a quantidade de Bufunfas do pagador
            return interaction.reply({ content: `:bank: :octagonal_sign: | ${client.tls.phrase(client, interaction, "misc.pay.error").replace("valor_repl", client.formata_num(bufunfas))}`, ephemeral: true })

        user.misc.money -= bufunfas
        alvo.money += bufunfas

        user.save();
        alvo.save();

        const caso = "movimentacao", quantia = bufunfas
        require('../../adm/automaticos/relatorio.js')({ client, caso, quantia })

        if (alvo.id === client.id() && quantia === 24.69) // Funny Number
            require('../../adm/data/conquistas')(client, 1, interaction.user.id, interaction)

        interaction.reply({ content: `:bank: :white_check_mark: | ${client.tls.phrase(client, interaction, "misc.pay.sucesso").replace("valor_repl", client.formata_num(bufunfas))} <@!${alvo.uid}>`, ephemeral: true })

        if (alvo.id !== client.id()) // Notificando o recebedor
            client.discord.users.fetch(alvo.uid, false).then((user_interno) => {

                // Enviando a mensagem no idioma do usuário alvo
                let emoji_dancante = client.emoji(emojis_dancantes)

                user_interno.send(`:bank: | ${client.tls.phrase(client, alvo.uid, "misc.pay.notifica").replace("user_repl", user.uid).replace("valor_repl", client.formata_num(bufunfas))} ${emoji_dancante}`)
            })
    }
}