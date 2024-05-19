const { EmbedBuilder } = require('discord.js')

const { getReportedUsers, checkUserGuildReported } = require('../../../database/schemas/User_reports')

module.exports = async ({ client, user, interaction, dados, pagina }) => {

    let operacao = parseInt(dados.split(".")[1])
    pagina = pagina || 0

    // Tratamento dos cliques
    // 1 -> Lista de usuários com advertência do servidor
    // 2 -> Lista de usuários reportados presentes no servidor

    if (operacao === 1) {

        // Navegando pelos usuários que foram advertidos no servidor
        await client.deferedResponse({ interaction })

        const warned_users = await client.getSingleWarnedGuildUser(interaction.guild.id)

        const obj = {
            content: warned_users.length > 0 ? client.tls.phrase(user, "mode.report.escolher_usuario") : client.tls.phrase(user, "mode.warn.sem_usuarios", 1),
            ephemeral: true
        }

        if (warned_users.length > 0) {

            // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
            if (warned_users.length < pagina * 24) pagina--

            const embed = new EmbedBuilder()
                .setTitle(`${client.tls.phrase(user, "mode.warn.usuarios_advertidos_titulo")} 🛑`)
                .setColor(client.embed_color(user.misc.color))
                .setThumbnail(interaction.guild.iconURL({ size: 2048 }))
                .setDescription(client.tls.phrase(user, "mode.warn.usuarios_advertidos_descricao"))
                .setFooter({
                    text: client.tls.phrase(user, "mode.warn.selecionar_usuario_advertido"),
                    iconURL: interaction.user.avatarURL({ dynamic: true })
                })

            // Menu para navegar entre os usuários com advertências do servidor
            const data = {
                title: { tls: "menu.menus.escolher_usuario" },
                pattern: "reports",
                alvo: "warn_browse",
                reback: "browse_button.warn_browse_user",
                operation: 0,
                values: warned_users
            }

            obj.embeds = [embed]
            obj.components = [client.create_menus({ client, interaction, user, data, pagina }), client.create_buttons([{ id: "chunks_panel_guild_verify", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19) }], interaction)]
            let row = client.menu_navigation(client, user, data, pagina)

            if (row.length > 0) // Botões de navegação
                obj.components.push(client.create_buttons(row, interaction))
        }

        return interaction.editReply(obj)

    } else if (operacao === 2) {

        // Navegando pelos usuários que receberam reportes em outros servidores e estão no servidor
        await client.deferedResponse({ interaction })

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
                    content: users_ids.length > 0 ? client.tls.phrase(user, "mode.report.escolher_usuario") : client.tls.phrase(user, "mode.report.sem_usuarios_report", 1),
                    ephemeral: true
                }

                if (users_ids.length > 0) { // Menu para navegar entre os usuários reportados
                    let reportes_guild

                    if (interaction.guild.id !== process.env.guild_id)
                        reportes_guild = await checkUserGuildReported(interaction.guild.id)
                    else if (process.env.owner_id.includes(interaction.user.id))
                        reportes_guild = await getReportedUsers() // Lista todos os usuários reportados salvos no Alonsal

                    if (reportes_guild.length > 0) {

                        // Subtrai uma página do total ( em casos de remoção de usuários e página em cache )
                        if (reportes_guild.length < pagina * 24) pagina--

                        const embed = new EmbedBuilder()
                            .setTitle(`${client.tls.phrase(user, "mode.report.usuarios_reportados_titulo")} 💂‍♂️`)
                            .setColor(client.embed_color(user.misc.color))
                            .setThumbnail(interaction.guild.iconURL({ size: 2048 }))
                            .setDescription(client.tls.phrase(user, "mode.report.descricao_busca_reporte"))
                            .setFooter({
                                text: client.tls.phrase(user, "mode.report.selecionar_membro"),
                                iconURL: interaction.user.avatarURL({ dynamic: true })
                            })

                        const data = {
                            title: { tls: "menu.menus.escolher_usuario" },
                            pattern: "reports",
                            alvo: "report_browse",
                            reback: "browse_button.report_browse_user",
                            operation: 0,
                            values: usuarios_reportados
                        }

                        pagina = parseInt(pagina)

                        obj.embeds = [embed]
                        obj.components = [client.create_menus({ client, interaction, user, data, pagina })]

                        let row = client.menu_navigation(client, user, data, pagina)

                        if (row.length > 0) // Botões de navegação
                            obj.components.push(client.create_buttons(row, interaction))
                    }
                }

                return interaction.editReply(obj)
            })
    } else
        require('../../chunks/panel_guild_verify')({ client, user, interaction })
}