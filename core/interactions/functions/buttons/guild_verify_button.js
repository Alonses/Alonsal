const { checkUserGuildWarned } = require('../../../database/schemas/Warns')
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

            // Menu para navegar entre os usuários com advertências do servidor
            const data = {
                alvo: "warn_browse",
                reback: "browse_button.warn_browse_user",
                operation: 0,
                values: warned_users
            }

            obj.components = [client.create_menus({ client, interaction, user, data, pagina })]
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

                // Verificando a quantidade de entradas e estimando o número de páginas
                const pages = usuarios_reportados.length / 6
                let paginas = pages - Math.floor(pages) > 0.5 ? Math.floor(pages) + 1 : Math.floor(pages)

                if (usuarios_reportados.length / 6 < 1)
                    paginas = 1

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

                        const data = {
                            alvo: "report_browse",
                            reback: "browse_button.report_browse_user",
                            operation: 0,
                            values: usuarios_reportados
                        }

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