const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("complaint")
        .setNameLocalizations({
            "pt-BR": 'denuncia',
            "es-ES": 'queja',
            "fr": 'plainte',
            "it": 'rimostranza',
            "ru": 'жалоба'
        })
        .setDescription("⌠💂⌡ Report something!")
        .addSubcommand(subcommand =>
            subcommand
                .setName("start")
                .setNameLocalizations({
                    "pt-BR": 'iniciar',
                    "es-ES": 'comenzar',
                    "fr": 'commencer',
                    "it": 'iniziare',
                    "ru": 'начать'
                })
                .setDescription("⌠💂⌡ Inicie um chat de denúncia")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💂⌡ Inicie um chat de denúncia',
                    "es-ES": '⌠💂⌡ Iniciar un chat de informe',
                    "fr": '⌠💂⌡ Démarrer un canal de signalement',
                    "it": '⌠💂⌡ Avvia una chat di report',
                    "ru": '⌠💂⌡ Начать канал жалоб'
                }))
        .addSubcommand(subcommand =>
            subcommand
                .setName("close")
                .setNameLocalizations({
                    "pt-BR": 'fechar',
                    "es-ES": 'cerrar',
                    "fr": 'fermer',
                    "it": 'chiudere',
                    "ru": 'закрывать'
                })
                .setDescription("⌠💂⌡ Encerre seu chat de denúncia")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💂⌡ Encerre seu chat de denúncia',
                    "es-ES": '⌠💂⌡ Termina tu chat de informe',
                    "fr": '⌠💂⌡ Terminer le chat de signalement',
                    "it": '⌠💂⌡ Termina la chat di segnalazione',
                    "ru": '⌠💂⌡ Закрыть чат жалоб'
                })),
    async execute(client, user, interaction) {

        let guild = await client.getGuild(interaction.guild.id)

        // Verificando se as denúncias em canais privados estão ativas no servidor
        if (!guild.conf.tickets)
            return client.tls.reply(interaction, user, "mode.denuncia.desativado", true, 3)

        let channel = await client.getTicket(interaction.guild.id, interaction.user.id)
        let solicitante = await client.getUserGuild(interaction, interaction.user.id)

        // Buscando os dados do canal no servidor
        let canal_servidor = interaction.guild.channels.cache.find(c => c.id === channel.cid)

        // Solicitando a função e executando
        require(`./subcommands/complaint_${interaction.options.getSubcommand()}`)({ client, user, interaction, channel, solicitante, canal_servidor })
    }
}