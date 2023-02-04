const { SlashCommandBuilder } = require('discord.js')

const { emojis_dancantes } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('⌠💸⌡ Receive your daily bufunfa')
        .setDescriptionLocalizations({
            "pt-BR": '⌠💸⌡ Pegue sua bufunfa diária',
            "es-ES": '⌠💸⌡ Recibe tu bufunfa diario',
            "fr": '⌠💸⌡ Recevez votre bufunfa quotidien',
            "it": '⌠💸⌡ Ottieni la tua bufunfa quotidiana',
            "ru": '⌠💸⌡ Получай свой ежедневный Bufunfa'
        }),
    async execute(client, user, interaction) {

        const date1 = new Date()
        let data_atual = date1.toDateString('pt-BR')

        if (data_atual === user.misc.daily) {
            const tempo_restante = Math.floor((date1.getTime() + (((23 - date1.getHours()) * 3600000) + ((60 - date1.getMinutes()) * 60000) + ((60 - date1.getSeconds()) * 1000))) / 1000)

            return interaction.reply({ content: `:bank: | ${client.tls.phrase(user, "misc.daily.error")} <t:${tempo_restante}:R>\n[ <t:${tempo_restante}:f> ]`, ephemeral: true })
        }

        const bufunfa = Math.floor(900 + (Math.random() * 500))

        user.misc.money += bufunfa
        user.misc.daily = date1.toDateString('pt-BR')

        const caso = "bufunfa", quantia = bufunfa
        require('../../adm/automaticos/relatorio.js')({ client, caso, quantia })

        user.save()

        interaction.reply({ content: `:money_with_wings: | ${client.tls.phrase(user, "misc.daily.daily").replace("valor_repl", bufunfa.toLocaleString("pt-BR"))} ${client.emoji(emojis_dancantes)}`, ephemeral: true })
    }
}