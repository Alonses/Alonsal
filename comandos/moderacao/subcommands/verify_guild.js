const { EmbedBuilder } = require('discord.js')

const { getReportedUsers } = require('../../../adm/database/schemas/Report')

module.exports = async ({ client, user, interaction }) => {

    let pagina = interaction.options.getInteger("page") || 1, i = 0
    pagina = pagina < 1 ? 1 : pagina

    await interaction.deferReply({
        ephemeral: true
    })

    const users = [], usernames = [], user_ids = []
    const usuarios_reportados = await getReportedUsers()

    const id_membros_guild = []

    interaction.guild.members.fetch()
        .then(membros => {

            // Salvando os dados no formato apropriado
            usuarios_reportados.forEach(valor => {
                users.push(valor)
            })

            // Listando todos os usuários do servidor para comparação
            membros.forEach(membro => { id_membros_guild.push(membro.user.id) })

            for (const user of usuarios_reportados)
                if (id_membros_guild.includes(user.uid) && i < 6) { // Listando os usuários que possuem denúncias e estão no servidor
                    usernames.push(`${client.defaultEmoji("diamond")} <@${user.uid}>`)
                    user_ids.push(`\`${(user.uid)}\``)

                    i++
                }

            // Verificando a quantidade de entradas e estimando o número de páginas
            const pages = usernames.length / 6
            let paginas = pages - Math.floor(pages) > 0.5 ? Math.floor(pages) + 1 : Math.floor(pages)

            if (usernames.length / 6 < 1)
                paginas = 1

            if (usernames.length > 6)
                rodape = `( 1 | ${paginas} ) - ${paginas} ${client.tls.phrase(user, "mode.report.rodape")}`

            if (pagina > paginas) // Número de página escolhida maior que as disponíveis
                return client.tls.editReply(interaction, user, "dive.rank.error_1", client.decider(user?.conf.ghost_mode, 0), client.emoji(1))

            const remover = pagina === paginas ? (pagina - 1) * 6 : usernames.length % 6 !== 0 ? pagina !== 2 ? (pagina - 1) * 6 : (pagina - 1) * 6 : (pagina - 1) * 6

            for (let x = 0; x < remover; x++) {
                usernames.shift()
                user_ids.shift()
            }

            rodape = `( ${pagina} | ${paginas} ) - ${paginas} ${client.tls.phrase(user, "mode.report.rodape")}`

            const embed = new EmbedBuilder()
                .setTitle(`> ${interaction.guild.name}`)
                .setColor(client.embed_color(user.misc.color))
                .setThumbnail(interaction.guild.iconURL({ size: 2048 }))

            if (usernames.length > 0)
                embed.addFields({
                    name: `${client.defaultEmoji("guard")} **${client.tls.phrase(user, "mode.report.reportados")}**`,
                    value: usernames.join("\n"),
                    inline: true
                }, {
                    name: `**${client.emoji("icon_id")} ${client.tls.phrase(user, "mode.report.identificador")}**`,
                    value: user_ids.join("\n"),
                    inline: true
                })
                    .setFooter({
                        text: rodape,
                        iconURL: interaction.user.avatarURL({ dynamic: true })
                    })
            else
                embed.setDescription(`\`\`\`✅ | ${client.tls.phrase(user, "mode.report.sem_reportes_guild")}\`\`\``)

            interaction.editReply({
                embeds: [embed],
                ephemeral: true
            })
        })
}