const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

const { getUserReports } = require('../../adm/database/schemas/Report')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("verify")
        .setDescription("⌠💂⌡ Check a user's history")
        .setDescriptionLocalizations({
            "pt-BR": '⌠💂⌡ Verificar histórico de um usuário',
            "es-ES": '⌠💂⌡ Consultar el historial de un usuario',
            "fr": '⌠💂⌡ Vérifier l\'historique d\'un utilisateur',
            "it": '⌠💂⌡ Controlla la cronologia di un utente',
            "ru": '⌠💂⌡ Проверить историю пользователя'
        })
        .addUserOption(option =>
            option.setName("user")
                .setNameLocalizations({
                    "pt-BR": 'usuario',
                    "es-ES": 'usuario',
                    "it": 'utente',
                    "ru": 'пользователь'
                })
                .setDescription("Mention a user as a target")
                .setDescriptionLocalizations({
                    "pt-BR": 'Marque outro usuário como alvo',
                    "es-ES": 'Mencionar a otro usuario',
                    "fr": 'Mentionner un utilisateur comme cible',
                    "it": 'Menziona un altro utente',
                    "ru": 'Упомянуть другого пользователя'
                }))
        .addStringOption(option =>
            option.setName("id")
                .setDescription("The user ID")
                .setDescriptionLocalizations({
                    "pt-BR": 'O ID do usuário',
                    "es-ES": 'Identificación de usuario',
                    "fr": 'ID de l\'utilisateur',
                    "it": 'ID utente',
                    "ru": 'ID пользователя'
                }))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(client, user, interaction) {

        let id_alvo = interaction.options.getUser("user") || null
        let entradas = interaction.options.data

        const valores = {
            id_alvo: null
        }

        // Coletando todas as entradas
        entradas.forEach(valor => {
            if (valor.name === "id")
                valores.id_alvo = valor.value
        })

        if (interaction.options.getUser("user"))
            id_alvo = id_alvo.id

        if (id_alvo === null)
            id_alvo = valores.id_alvo

        // Sem usuário informado
        if (id_alvo === null)
            return client.tls.reply(interaction, user, "mode.report.sem_usuario", true, 0)

        // Coletando os dados de histórico do usuário
        const reports = await getUserReports(id_alvo)
        const user_c = await client.getUser(id_alvo)
        let user_alvo = await client.getUserGuild(interaction, id_alvo) // Dados de membro do servidor

        // Usuário não faz parte do servidor
        if (!user_alvo)
            return client.tls.reply(interaction, user, "mode.report.usuario_nao_encontrado", true, 1)

        let apelido = user_alvo.nickname !== null ? user_alvo.nickname : user_alvo.user.username

        // Avatar do usuário
        let avatar_user = `https://cdn.discordapp.com/avatars/${user_alvo.id}/${user_alvo.user.avatar}.gif?size=1024`

        if (avatar_user !== null) {
            avatar_user = avatar_user.replace(".webp", ".gif")

            await fetch(avatar_user)
                .then(res => {
                    if (res.status !== 200)
                        avatar_user = avatar_user.replace('.gif', '.webp')
                })
        } else
            avatar_user = ""

        let avisos = 0
        let descricao = `\`\`\`✅ | ${client.tls.phrase(user, "mode.report.sem_report")}\`\`\``
        const historico = []

        // Quantificando os relatórios sobre o usuário
        reports.forEach(valor => {
            avisos++

            historico.push(`-> ${new Date(valor.timestamp * 1000).toLocaleDateString("pt-BR")} | ${valor.relatory}`)
        })

        if (avisos > 0)
            descricao = `\`\`\`💢 | ${client.tls.phrase(user, "mode.report.com_report")}\n\n${historico.join("\n").slice(0, 1000)}\`\`\``

        const infos_user = new EmbedBuilder()
            .setTitle(`> ${apelido}`)
            .setColor(client.embed_color(user_c.misc.color))
            .setThumbnail(avatar_user)
            .addFields(
                {
                    name: ":globe_with_meridians: **Discord**",
                    value: `\`${user_alvo.user.username.replace(/ /g, "")}#${user_alvo.user.discriminator}\``,
                    inline: true
                },
                {
                    name: ":label: **Discord ID**",
                    value: `\`${user_alvo.id}\``,
                    inline: true
                },
                {
                    name: `**:man_guard: ${client.tls.phrase(user, "mode.report.reporte")}: ${avisos}**`,
                    value: "⠀",
                    inline: true
                }
            )
            .setDescription(descricao)

        interaction.reply({ embeds: [infos_user], ephemeral: true })
    }
}