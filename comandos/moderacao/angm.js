const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js')
const { writeFileSync, existsSync, unlinkSync } = require("fs")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('notify')
        .setNameLocalizations({
            "pt-BR": 'notificar',
            "es-ES": 'notificar',
            "fr": 'notifier'
        })
        .setDescription('⌠💂⌡ (Dis)Enable announces for free games')
        .setDescriptionLocalizations({
            "pt-BR": '⌠💂⌡ (Des)Habilitar anúncio de games free',
            "es-ES": '⌠💂⌡ (Des)Habilitar anuncios para juegos gratis',
            "fr": '⌠💂⌡ (Dés)activer les publicités pour les jeux gratuits'
        })
        .addRoleOption(option =>
            option.setName('role')
                .setNameLocalizations({
                    "pt-BR": 'cargo',
                    "fr": 'role'
                })
                .setDescription('The role that will be notified')
                .setDescriptionLocalizations({
                    "pt-BR": 'O cargo que será notificado',
                    "es-ES": 'El rol a ser notificado',
                    "fr": 'Le role qui sera notifié'
                }))
        .addChannelOption(option =>
            option.setName('channel')
                .setNameLocalizations({
                    "pt-BR": 'canal',
                    "es-ES": 'canal',
                    "fr": 'salon'
                })
                .setDescription('The channel that will be used')
                .setDescriptionLocalizations({
                    "pt-BR": 'O canal que será usado',
                    "es-ES": 'El canal que se utilizará',
                    "fr": 'Le canal qui sera utilisé'
                }))
        .addStringOption(option =>
            option.setName('language')
                .setNameLocalizations({
                    "pt-BR": 'idioma',
                    "es-ES": 'idioma',
                    "fr": 'langue'
                })
                .setDescription('O idioma que será utilizado')
                .addChoices(
                    { name: 'Português', value: 'pt-br' },
                    { name: 'English', value: 'en-us' },
                    { name: 'Español', value: 'es-es' },
                    { name: 'Français', value: 'fr-fr' },
                    { name: 'Alonsês', value: 'al-br' }
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator)
    ,
    async execute(client, interaction) {

        const { moderacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const membro_sv = interaction.guild.members.cache.get(interaction.user.id)

        if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageChannels) && interaction.user.id !== "665002572926681128")
            return interaction.reply({ content: moderacao[5]["moderadores"], ephemeral: true }) // Libera configuração para proprietários e adms apenas

        let opcao_remove = false, entradas = interaction.options.data

        const ent_canal = ["canal", "channel", "salon"], ent_cargo = ["cargo", "role"], ent_idioma = ["idioma", "language", "langue"]

        const notificador = {
            canal: null,
            cargo: null,
            idioma: null
        }

        // Coletando todas as entradas
        entradas.forEach(valor => {
            if (ent_cargo.includes(valor.name))
                notificador.cargo = valor.value

            if (ent_idioma.includes(valor.name))
                notificador.idioma = valor.value

            if (ent_canal.includes(valor.name)) {
                notificador.canal = valor.value

                if (valor.channel.type !== 0 && valor.channel.type !== 5) // Canal inválido
                    return interaction.reply({ content: `:octagonal_sign: | ${moderacao[6]["tipo_canal"]}`, ephemeral: true })
            }
        })

        if (!notificador.idioma)
            notificador.idioma = client.idioma.getLang(interaction)

        let mensagem = `:video_game: | O Servidor ( \`${interaction.guild.name}\` | \`${interaction.guild.id}\` ) não recebe mais atts de jogos grátis`

        if (!notificador.canal || !notificador.cargo) { // Removendo o anúncio do servidor 

            opcao_remove = true

            if (existsSync(`./arquivos/data/games/${interaction.guild.id}.json`))
                unlinkSync(`./arquivos/data/games/${interaction.guild.id}.json`)
        }

        if (!opcao_remove) {
            writeFileSync(`./arquivos/data/games/${interaction.guild.id}.json`, JSON.stringify(notificador))
            delete require.cache[require.resolve(`../../arquivos/data/games/${interaction.guild.id}.json`)]

            mensagem = `:video_game: | O Servidor ( \`${interaction.guild.name}\` | \`${interaction.guild.id}\` ) agora recebe atts de jogos grátis`
        }

        client.channels.cache.get('872865396200452127').send(mensagem)

        let feedback_user = moderacao[6]["anuncio_games"]

        if (opcao_remove)
            feedback_user = `:mobile_phone_off: | ${moderacao[6]["anuncio_off"]}`

        interaction.reply({ content: feedback_user.replace("repl_canal", `<#${notificador.canal}>`), ephemeral: true })
    }
}