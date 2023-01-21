const { readdirSync, unlinkSync } = require('fs')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { busca_badges, badgeTypes } = require('../../adm/data/badges')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('data')
        .setDescription('⌠👤⌡ Everything we know about you')
        .setDescriptionLocalizations({
            "pt-BR": '⌠👤⌡ Tudo o que sabemos sobre você',
            "es-ES": '⌠👤⌡ Todo lo que sabemos de ti',
            "fr": '⌠👤⌡ Tout ce que l\'on sait sur vous',
            "it": '⌠👤⌡ Tutto quello che sappiamo di te'
        })
        .addBooleanOption(option =>
            option.setName("delete")
                .setNameLocalizations({
                    "pt-BR": 'excluir',
                    "es-ES": 'eliminar',
                    "fr": 'nettoyer',
                    "it": 'elimina'
                })
                .setDescription("Request the deletion of your data in Alonsal")
                .setDescriptionLocalizations({
                    "pt-BR": 'Solicitar a exclusão de seus dados no Alonsal',
                    "es-ES": 'Solicitar la eliminación de sus datos en Alonsal',
                    "fr": 'Demander la suppression de vos données d\'Alonsal',
                    "it": 'Richiedi la cancellazione dei tuoi dati in Alonsal'
                })),
    async execute(client, interaction) {

        const user = await client.getUser(interaction.user.id)
        const solicitar_exclusao = interaction.options.data
        let exclusao = false

        if (solicitar_exclusao.length > 0)
            exclusao = interaction.options.data[0].value

        const ranking = []

        for (const folder of readdirSync(`./arquivos/data/rank/`)) {
            for (const file of readdirSync(`./arquivos/data/rank/${folder}`).filter(file => file.endsWith('.json'))) {
                if (file.includes(interaction.user.id)) {

                    let server = client.guilds().get(folder)

                    if (!server)
                        nome_server = client.tls.phrase(client, interaction, "manu.data.server_desconhecido")
                    else
                        nome_server = server.name

                    ranking.push(nome_server)
                }
            }
        }

        if (ranking.length < 1)
            return client.tls.reply(client, interaction, "manu.data.sem_dados", true)

        if (exclusao) { // Excluindo os dados do usuário do bot

            return interaction.reply({ content: 'Uma ceira bem enceirada vem por aí...', ephemeral: true })

            for (const folder of readdirSync(`./arquivos/data/rank/`)) {
                for (const file of readdirSync(`./arquivos/data/rank/${folder}`).filter(file => file.endsWith('.json'))) {
                    if (file.includes(interaction.user.id))
                        unlinkSync(`./arquivos/data/rank/${folder}/${file}`)
                }
            }

            client.tls.reply(client, interaction, "manu.data.dados_removidos")
        } else {
            dados_conhecidos = `**${client.tls.phrase(client, interaction, "manu.data.ranking_guilds")}:**\`\`\`fix\n${lista_servidores(ranking, 250, client)}\`\`\``

            // if (user.redes.length > 0) {
            //     dados_conhecidos += '\n**Links externos: **\n'

            //     user.redes.forEach(valor => {
            //         if (Object.values(valor)[0]) // Listando as redes linkadas
            //             dados_conhecidos += `\`${Object.keys(valor)[0]}\`, `
            //     })
            // }

            // if (user.badges.badge_list.length > 0)
            //     dados_conhecidos += `\n\n**Badges:**\n${busca_badges(client, badgeTypes.ALL, interaction.user.id, interaction).build(client, interaction)}`

            const embed = new EmbedBuilder()
                .setTitle(client.tls.phrase(client, interaction, "manu.data.dados_conhecidos"))
                .setColor(client.embed_color(user.misc.color))
                .setDescription(`${client.tls.phrase(client, interaction, "manu.data.resumo_dados")}\n\n${dados_conhecidos}`)
                .setFooter({ text: client.tls.phrase(client, interaction, "manu.data.dica_rodape") })

            interaction.reply({ embeds: [embed], ephemeral: true })
        }
    }
}

function lista_servidores(servidores, linha_corte, client) {

    let nome_servidores = servidores.join(", ")

    if (nome_servidores.length > linha_corte) {

        let i = linha_corte
        nome_interno = nome_servidores.slice(0, linha_corte)
        do {
            nome_interno = nome_servidores.slice(0, i)

            i += 1
        } while (!nome_interno.includes(", "))

        nome_servidores = nome_interno
        ultima_posicao = nome_servidores.lastIndexOf(", ")

        // Quantidade de servidores listados anteriormente
        qtd_servidores = (nome_servidores.match(/,/g) || []).length

        nome_servidores = nome_servidores.slice(0, ultima_posicao)
        servidores_restantes = servidores.length - qtd_servidores

        if (servidores_restantes > 1)
            nome_servidores = `${nome_servidores} ${client.tls.phrase(client, interaction, "manu.data.outros_servers").replace("server_repl", servidores_restantes)}`
        else
            nome_servidores = `${nome_servidores} ${client.tls.phrase(client, interaction, "manu.data.um_server")}`
    }

    return nome_servidores
}