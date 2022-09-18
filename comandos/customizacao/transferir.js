const { SlashCommandBuilder } = require('discord.js')

const busca_emoji = require('../../adm/funcoes/busca_emoji')
const { emojis_dancantes } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setNameLocalizations({
            "pt-BR": 'dei-lhe',
            "es-ES": 'transferir',
            "fr": 'payer'
        })
        .setDescription('⌠💸⌡ Transfer Bufunfa to other users')
        .setDescriptionLocalizations({
            "pt-BR": '⌠💸⌡ Transfira Bufunfa para outros usuários',
            "es-ES": '⌠💸⌡ Transferir Bufunfa a otros usuarios',
            "fr": '⌠💸⌡ Transférer Bufunfa à d\'autres utilisateurs'
        })
        .addUserOption(option =>
            option.setName('user')
                .setNameLocalizations({
                    "pt-BR": 'usuario',
                    "es-ES": 'usuario',
                    "fr": 'user'
                })
                .setDescription('The user who will receive')
                .setDescriptionLocalizations({
                    "pt-BR": 'O usuário que receberá',
                    "es-ES": 'El usuario que recibirá',
                    "fr": 'L\'utilisateur qui recevra'
                })
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('amount')
                .setNameLocalizations({
                    "pt-BR": 'quantia',
                    "es-ES": 'monto',
                    "fr": 'montant'
                })
                .setDescription('The amount that will be transferred')
                .setDescriptionLocalizations({
                    "pt-BR": 'A quantidade que será transferida',
                    "es-ES": 'El monto a transferir',
                    "fr": 'Le montant à transférer'
                })
                .setRequired(true)),
    async execute(client, interaction) {

        let user_alvo = interaction.options.getUser('user') || interaction.options.getUser('usuario')

        let { customizacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const user = client.custom.getUser(interaction.user.id)
        const alvo = client.custom.getUser(user_alvo.id)

        let bufunfas = interaction.options.data[1].value

        if (bufunfas < 1)
            return interaction.reply({ content: `:bank: :octagonal_sign: | ${customizacao[2]["error_2"]}`, ephemeral: true })

        if (user.money < bufunfas) // Conferindo a quantidade de Bufunfas do pagador
            return interaction.reply({ content: `:bank: :octagonal_sign: | ${customizacao[2]["error"].replace("valor_repl", bufunfas.toLocaleString("pt-BR"))}`, ephemeral: true })

        user.money -= bufunfas
        alvo.money += bufunfas

        client.custom.saveUser(user)
        client.custom.saveUser(alvo)

        interaction.reply({ content: `:bank: :white_check_mark: | ${customizacao[2]["sucesso"].replace("valor_repl", bufunfas.toLocaleString("pt-BR"))} <@!${alvo.id}>`, ephemeral: true })

        let emoji_dancante = busca_emoji(client, emojis_dancantes)

        if (alvo.id !== client.user.id) // Notificando o recebedor
            client.users.fetch(alvo.id, false).then((user_interno) => {

                // Enviando a mensagem no idioma do usuário alvo
                let { customizacao } = require(`../../arquivos/idiomas/${alvo.lang}.json`)

                user_interno.send(`:bank: | ${customizacao[2]["notifica"].replace("user_repl", user.id).replace("valor_repl", bufunfas.toLocaleString("pt-BR"))} ${emoji_dancante}`)
            })
    }
}