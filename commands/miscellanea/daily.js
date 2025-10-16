const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("daily")
        .setDescription("⌠💸⌡ Receive your daily bufunfa")
        .setDescriptionLocalizations({
            "de": '⌠💸⌡ Holen Sie sich Ihr tägliches Bufunfa',
            "es-ES": '⌠💸⌡ Recibe tu bufunfa diario',
            "fr": '⌠💸⌡ Recevez votre bufunfa quotidien',
            "it": '⌠💸⌡ Ottieni la tua bufunfa quotidiana',
            "pt-BR": '⌠💸⌡ Pegue sua bufunfa diária',
            "ru": '⌠💸⌡ Получай свой ежедневный Bufunfa'
        }),
    async execute({ client, user, interaction }) {

        const date1 = new Date()
        let data_atual = date1.toDateString('pt-BR')

        if (data_atual === user.misc.daily) {
            const tempo_restante = Math.floor((date1.getTime() + (((23 - date1.getHours()) * 3600000) + ((60 - date1.getMinutes()) * 60000) + ((60 - date1.getSeconds()) * 1000))) / 1000)

            return client.tls.reply(interaction, user, "misc.daily.error", true, 9, tempo_restante)
        }

        const bufunfa = client.execute("random", { intervalo: 600, base: 1200 })

        user.misc.money += bufunfa
        user.misc.daily = data_atual
        await user.save()

        // Registrando as movimentações de bufunfas para o usuário
        await client.registryStatement(user.uid, "misc.b_historico.daily", true, bufunfa)
        await client.journal("gerado", bufunfa)

        interaction.reply({
            content: `${client.tls.phrase(user, "misc.daily.daily", 14, client.execute("locale", { valor: bufunfa }))} ${client.emoji("emojis_dancantes")}`,
            flags: "Ephemeral"
        })
    }
}