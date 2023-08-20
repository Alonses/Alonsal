const { SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js')

const { getUserRankServer } = require('../../adm/database/schemas/Rank_s')

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

        const membro_sv = await client.getMemberGuild(interaction, interaction.user.id)

        if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageGuild) && interaction.user.id !== client.owners[0])
            return client.tls.reply(interaction, user, "mode.xp.permissao", true, 3)

        // Coletando os dados do usuário informado no servidor
        const alvo = interaction.options.getUser("user")
        const user_c = await getUserRankServer(alvo.id, interaction.guild.id)

        // Validando se o usuário tem o ranking habilitado
        if (!await client.verifyUserRanking(user_c.uid))
            return client.tls.reply(interaction, user, "mode.ranking.error", true, 5)

        user_c.nickname = alvo.username
        let novo_exp = parseFloat(interaction.options.get('xp').value)

        user_c.xp = parseFloat(novo_exp)
        novo_nivel = parseFloat(novo_exp / 1000)

        await user_c.save()

        client.tls.reply(interaction, user, "mode.xp.sucesso", true, 17, [user_c.nickname, novo_exp.toFixed(2), novo_nivel.toFixed(2)])
    }
}