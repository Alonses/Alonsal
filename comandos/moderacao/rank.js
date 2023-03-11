const { existsSync, writeFileSync } = require('fs')
const { SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("xp")
        .setDescription("⌠💂⌡ Adjust some user's XP")
        .setDescriptionLocalizations({
            "pt-BR": '⌠💂⌡ Ajuste o XP de algum usuário',
            "es-ES": '⌠💂⌡ Ajustar la XP de algunos usuarios',
            "fr": '⌠💂⌡ Ajustez XP pour certains utilisateurs',
            "it": '⌠💂⌡ Regola gli XP di un altro utente',
            "ru": '⌠💂⌡ Настройка опыта некоторых пользователей'
        })
        .addUserOption(option =>
            option.setName("user")
                .setNameLocalizations({
                    "pt-BR": 'usuario',
                    "es-ES": 'usuario',
                    "it": 'utente',
                    "ru": 'пользователя'
                })
                .setDescription("The user to adjust")
                .setDescriptionLocalizations({
                    "pt-BR": 'O usuário a ser ajustado',
                    "es-ES": 'El usuario para ajustar',
                    "fr": 'Utilisateur cible',
                    "it": 'L\'utente da aggiornare',
                    "ru": 'Пользователь для установки'
                })
                .setRequired(true))
        .addNumberOption(option =>
            option.setName("xp")
                .setDescription("What is the new XP?")
                .setDescriptionLocalizations({
                    "pt-BR": 'Qual o novo XP?',
                    "es-ES": '¿Qué es el nuevo XP?',
                    "fr": 'Qu\'est-ce que le nouvel XP?',
                    "it": 'Qual è il nuovo XP?',
                    "ru": 'Что такое новый XP?'
                })
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.ManageChannels | PermissionFlagsBits.Administrator),
    async execute(client, user, interaction) {

        const membro_sv = await client.getUserGuild(interaction, interaction.user.id)

        if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageGuild) && interaction.user.id !== client.owners[0])
            return client.tls.reply(interaction, user, "mode.xp.permissao", true, 3)

        // Coletando os dados do usuário informado no servidor
        const usuario = interaction.options.getUser("user")
        let user_c = await client.getUserRankServer(usuario.id, interaction.guild.id)
        user_c = user_c[0]

        // Validando se o usuário tem o ranking habilitado
        if (!await client.userRanking(user_c.uid)) {
            client.tls.reply(interaction, user, "mode.ranking.error", true, 5)
            return
        }

        user_c.nickname = usuario.username
        let novo_exp = parseFloat(interaction.options.get('xp').value)

        user_c.xp = parseFloat(novo_exp)
        novo_nivel = parseFloat(novo_exp / 1000)

        try {
            user_c.save()
        } catch (err) {
            console.log(err)
            return client.tls.reply(interaction, user, "mode.xp.error_2", true, 0)
        }

        interaction.reply({ content: `:military_medal: | ${client.tls.phrase(user, "mode.xp.sucesso", true, 0).replace("nick_repl", user_c.nickname).replace("exp_repl", novo_exp.toFixed(2)).replace("nivel_repl", novo_nivel.toFixed(2))}`, ephemeral: true })
    }
}