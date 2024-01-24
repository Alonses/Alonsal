const { EmbedBuilder } = require('discord.js')

const { getReportedUsers, checkUserGuildReported } = require('../../../database/schemas/Report')

module.exports = async ({ client, user, interaction, dados, pagina }) => {

    let operacao = parseInt(dados.split(".")[1])
    pagina = pagina || 0

    // Tratamento dos cliques
    // 1 -> Lista de usuários com advertência do servidor
    // 2 -> Lista de usuários reportados presentes no servidor

    if (operacao === 1) {

        // Navegando pelos usuários que foram advertidos no servidor
        await interaction.deferUpdate({ ephemeral: true })

        const warned_users = await client.getSingleWarnedGuildUser(interaction.guild.id)

        const obj = {
            content: warned_users.length > 0 ? client.tls.phrase(user, "mode.report.escolher_usuario") : "🔍 | Não há usuários com advertências no servidor!",
            ephemeral: true
        }

        if (warned_users.length > 0) {

            // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
            if (warned_users.length < pagina * 24)
                pagina--

            const embed = new EmbedBuilder()
                .setTitle("> Usuários com advertências 🛑")
                .setColor(client.embed_color(user.misc.color))
                .setThumbnail(interaction.guild.iconURL({ size: 2048 }))
                .setDescription("Todos os membros com advertências ativas no momento estão listados abaixo\n\nSelecione um para gerenciar as advertências que o membro recebeu.")
                .setFooter({
                    text: "Selecione um membro abaixo para gerenciar suas advertências neste servidor.",
                    iconURL: interaction.user.avatarURL({ dynamic: true })
                })

            // Menu para navegar entre os usuários com advertências do servidor
            const data = {
                alvo: "warn_browse",
                reback: "browse_button.warn_browse_user",
                operation: 0,
                values: warned_users
            }

            obj.embeds = [embed]
            obj.components = [client.create_menus({ client, interaction, user, data, pagina }), client.create_buttons([{ id: "chunks_panel_guild_verify", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19) }], interaction)]
            let row = client.menu_navigation(data, pagina)

            if (row.length > 0) // Botões de navegação
                obj.components.push(client.create_buttons(row, interaction))
        }

        interaction.editReply(obj)

    } else if (operacao === 2) {

        // Navegando pelos usuários que receberam reportes em outros servidores e estão no servidor
        await interaction.deferUpdate({ ephemeral: true })

        const users = [], users_ids = [], id_membros_guild = []
        const usuarios_reportados = await getReportedUsers()

        interaction.guild.members.fetch()
            .then(async membros => {

                // Salvando os dados no formato apropriado
                usuarios_reportados.forEach(valor => { users.push(valor) })

                // Listando todos os usuários do servidor para comparação
                membros.forEach(membro => { id_membros_guild.push(membro.user.id) })

                for (const user of usuarios_reportados) // Listando os usuários que possuem denúncias e estão no servidor
                    if (id_membros_guild.includes(user.uid)) users_ids.push(user.uid)

                const obj = {
                    content: users_ids.length > 0 ? client.tls.phrase(user, "mode.report.escolher_usuario") : "🔍 | Não há usuários reportados presentes no servidor!",
                    ephemeral: true
                }

                if (users_ids.length > 0) {
                    // Menu para navegar entre os usuários reportados
                    const reportes_guild = await checkUserGuildReported(interaction.guild.id)

                    if (reportes_guild.length > 0) {
                        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
                        if (reportes_guild.length < pagina * 24)
                            pagina--

                        const embed = new EmbedBuilder()
                            .setTitle("> Usuários reportados 💂‍♂️")
                            .setColor(client.embed_color(user.misc.color))
                            .setThumbnail(interaction.guild.iconURL({ size: 2048 }))
                            .setDescription("Todos os membros que receberam reportes externos estão listados abaixo\n\nSelecione um para verificar seus reportes recebidos em outros servidores.")
                            .setFooter({
                                text: "Selecione um membro abaixo para gerenciar seus reportes de outros servidores.",
                                iconURL: interaction.user.avatarURL({ dynamic: true })
                            })

                        const data = {
                            alvo: "report_browse",
                            reback: "browse_button.report_browse_user",
                            operation: 0,
                            values: usuarios_reportados
                        }

                        obj.embeds = [embed]
                        obj.components = [client.create_menus({ client, interaction, user, data, pagina })]

                        let row = client.menu_navigation(data, pagina)

                        if (row.length > 0) // Botões de navegação
                            obj.components.push(client.create_buttons(row, interaction))
                    }
                }

                return interaction.editReply(obj)
            })
    } else
        require('../../chunks/panel_guild_verify')({ client, user, interaction })
}