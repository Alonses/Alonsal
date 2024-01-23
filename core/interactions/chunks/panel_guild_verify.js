const { EmbedBuilder } = require('discord.js')

const { getReportedUsers } = require('../../database/schemas/Report')

module.exports = async ({ client, user, interaction }) => {

    if (!interaction.customId)
        await interaction.deferReply({ ephemeral: true })
    else
        await interaction.deferUpdate({ ephemeral: true })

    const users = [], users_ids = [], id_membros_guild = []
    const usuarios_reportados = await getReportedUsers()
    const warned_users = await client.getSingleWarnedGuildUser(interaction.guild.id)

    interaction.guild.members.fetch()
        .then(async membros => {

            // Salvando os dados no formato apropriado
            usuarios_reportados.forEach(valor => { users.push(valor) })

            // Listando todos os usuários do servidor para comparação
            membros.forEach(membro => { id_membros_guild.push(membro.user.id) })

            for (const user of usuarios_reportados) // Listando os usuários que possuem denúncias e estão no servidor
                if (id_membros_guild.includes(user.uid)) users_ids.push(user.uid)

            const embed = new EmbedBuilder()
                .setTitle(`> ${interaction.guild.name}`)
                .setColor(client.embed_color(user.misc.color))
                .setThumbnail(interaction.guild.iconURL({ size: 2048 }))
                .setDescription("Esse é o painel de usuários que possuem advertências ativas no servidor, e de receberam denúncias em servidores externos e estão presentes neste servidor.")
                .addFields(
                    {
                        name: `${client.emoji(0)} **Advertidos: \`${warned_users.length}\`**`,
                        value: "⠀",
                        inline: true
                    },
                    {
                        name: `${client.defaultEmoji("guard")} **${client.tls.phrase(user, "mode.report.reportados")}: \`${users_ids.length}\`**`,
                        value: "⠀",
                        inline: true
                    }
                )
                .setFooter({
                    text: "Selecione qual área deseja visualizar com os botões abaixo.",
                    iconURL: interaction.user.avatarURL({ dynamic: true })
                })

            const b_disabled = [false, false]

            // Sem membros que receberam advertências no servidor
            if (warned_users.length < 1)
                b_disabled[0] = true

            // Sem membros reportados externamente presentes no servidor
            if (users_ids.length < 1)
                b_disabled[1] = true

            const botoes = [
                { id: "guild_verify_button", name: "Atualizar", type: 1, emoji: client.emoji(42), data: "3" },
                { id: "guild_verify_button", name: "Advertências", type: 1, emoji: client.emoji(0), data: "1", disabled: b_disabled[0] },
                { id: "guild_verify_button", name: "Reportados", type: 1, emoji: client.defaultEmoji("guard"), data: "2", disabled: b_disabled[1] }
            ]

            interaction.editReply({
                embeds: [embed],
                components: [client.create_buttons(botoes, interaction)],
                ephemeral: true
            })
        })
}