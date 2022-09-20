const { SlashCommandBuilder } = require('discord.js')

const busca_emoji = require('../../adm/discord/busca_emoji')
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

        let { customizacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)

        let user_alvo = interaction.options.getUser('usuario') || interaction.options.getUser('user')
        let bufunfas = interaction.options.data[1].value

        if (bufunfas < 0.01)
            return interaction.reply({ content: `:bank: :octagonal_sign: | ${customizacao[2]["error_2"]}`, ephemeral: true })

        const user = client.usuarios.getUser(interaction.user.id)
        const alvo = client.usuarios.getUser(user_alvo.id)

        if (alvo.id == user.id)
            return interaction.reply({ content: `:bank: :octagonal_sign: | ${customizacao[2]["error_3"]}`, ephemeral: true })

        formata_num = (valor) => valor.toLocaleString("pt-BR", { minimunFractionDigits: 2 })

        if (user.money < bufunfas) // Conferindo a quantidade de Bufunfas do pagador
            return interaction.reply({ content: `:bank: :octagonal_sign: | ${customizacao[2]["error"].replace("valor_repl", formata_num(bufunfas))}`, ephemeral: true })

        user.money -= bufunfas
        alvo.money += bufunfas

        client.usuarios.saveUser(user)
        client.usuarios.saveUser(alvo)

        const caso = "movimentacao", quantia = bufunfas
        require('../../adm/automaticos/relatorio.js')({ client, caso, quantia })

        interaction.reply({ content: `:bank: :white_check_mark: | ${customizacao[2]["sucesso"].replace("valor_repl", formata_num(bufunfas))} <@!${alvo.id}>`, ephemeral: true })

        if (alvo.id !== client.user.id) // Notificando o recebedor
            client.users.fetch(alvo.id, false).then((user_interno) => {

                // Enviando a mensagem no idioma do usuário alvo
                let { customizacao } = require(`../../arquivos/idiomas/${alvo.lang}.json`)
                let emoji_dancante = busca_emoji(client, emojis_dancantes)

                user_interno.send(`:bank: | ${customizacao[2]["notifica"].replace("user_repl", user.id).replace("valor_repl", formata_num(bufunfas))} ${emoji_dancante}`)
            })
    }
}