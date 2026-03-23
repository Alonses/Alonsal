const { SlashCommandBuilder, InteractionContextType } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("complaint")
        .setNameLocalizations({
            "de": 'beschwerde',
            "es-ES": 'queja',
            "fr": 'plainte',
            "it": 'rimostranza',
            "pt-BR": 'denuncia',
            "ru": 'жалоба'
        })
        .setDescription("⌠💂⌡ Report something!")
        .addSubcommand(subcommand =>
            subcommand
                .setName("start")
                .setNameLocalizations({
                    "es-ES": 'comenzar',
                    "fr": 'commencer',
                    "it": 'iniziare',
                    "pt-BR": 'iniciar',
                    "ru": 'начать'
                })
                .setDescription("⌠💂⌡ Start a report chat")
                .setDescriptionLocalizations({
                    "de": '⌠💂⌡ Starten Sie Ihren Meldechat',
                    "es-ES": '⌠💂⌡ Iniciar un chat de informe',
                    "fr": '⌠💂⌡ Démarrer un canal de signalement',
                    "it": '⌠💂⌡ Avvia una chat di report',
                    "pt-BR": '⌠💂⌡ Inicie um chat de denúncia',
                    "ru": '⌠💂⌡ Начать канал жалоб'
                }))
        .addSubcommand(subcommand =>
            subcommand
                .setName("close")
                .setNameLocalizations({
                    "es-ES": 'cerrar',
                    "fr": 'fermer',
                    "it": 'chiudere',
                    "pt-BR": 'fechar',
                    "ru": 'закрывать'
                })
                .setDescription("⌠💂⌡ Close your report chat")
                .setDescriptionLocalizations({
                    "de": '⌠💂⌡ Beenden Sie Ihren Meldechat',
                    "es-ES": '⌠💂⌡ Termina tu chat de informe',
                    "fr": '⌠💂⌡ Terminer le chat de signalement',
                    "it": '⌠💂⌡ Termina la chat di segnalazione',
                    "pt-BR": '⌠💂⌡ Encerre seu chat de denúncia',
                    "ru": '⌠💂⌡ Закрыть чат жалоб'
                }))
        .setContexts(InteractionContextType.Guild),
    async execute({ client, user, interaction }) {

        const guild = await client.getGuild(interaction.guild.id)

        // Verificando se as denúncias em canais privados estão ativas no servidor
        if (!guild.conf.tickets)
            return client.tls.reply(interaction, user, "mode.denuncia.desativado", true, 3)

        if (interaction.options.getSubcommand() === "start") {
            const dados = "0.3.0.0" // Redirecionando o evento
            return require("../../core/interactions/functions/buttons/complaints")({ client, user, interaction, dados })
        }

        // Solicitando a função e executando
        require(`./subcommands/complaint_${interaction.options.getSubcommand()}`)({ client, user, interaction })
    }
}