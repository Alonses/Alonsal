const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const create_menus = require('../../adm/discord/create_menus.js')
const { buildAllBadges } = require('../../adm/data/badges')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("data")
        .setDescription("⌠👤⌡ Everything we know about you")
        .addSubcommand(subcommand =>
            subcommand
                .setName("summary")
                .setNameLocalizations({
                    "pt-BR": 'resumo',
                    "es-ES": 'resumen',
                    "fr": 'resume',
                    "it": 'riepilogo',
                    "ru": 'все'
                })
                .setDescription("⌠👤⌡ Everything we know about you")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Tudo o que sabemos sobre você',
                    "es-ES": '⌠👤⌡ Todo lo que sabemos de ti',
                    "fr": '⌠👤⌡ Tout ce que l\'on sait sur vous',
                    "it": '⌠👤⌡ Tutto quello che sappiamo di te',
                    "ru": '⌠👤⌡ Все, что мы знаем о тебе'
                })
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("delete")
                .setNameLocalizations({
                    "pt-BR": 'excluir',
                    "es-ES": 'borrar',
                    "fr": 'supprimer',
                    "it": 'eliminare',
                    "ru": 'удалить'
                })
                .setDescription("⌠👤⌡ Request the deletion of your data in Alonsal")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Solicitar a exclusão de seus dados no Alonsal',
                    "es-ES": '⌠👤⌡ Solicitar la eliminación de sus datos en Alonsal',
                    "fr": '⌠👤⌡ Demander la suppression de vos données d\'Alonsal',
                    "it": '⌠👤⌡ Richiedi la cancellazione dei tuoi dati in Alonsal',
                    "ru": '⌠👤⌡ Запросить удаление ваших данных на Alonsal'
                })
        ),
    async execute(client, user, interaction) {

        // Lista todos os dados que o bot salvou do usuário
        if (interaction.options.getSubcommand() === "summary") {
            const ranking = []
            const guild_ranking = await client.getUserRankServers(user.uid, interaction.guild.id)

            // Listando os servidores que o usuário possui ranking
            guild_ranking.forEach(valor => {
                let server = client.guilds().get(valor.sid)

                if (!server)
                    nome_server = client.tls.phrase(user, "manu.data.server_desconhecido")
                else
                    nome_server = server.name

                ranking.push(nome_server)
            })

            if (ranking.length < 1)
                return client.tls.reply(interaction, user, "manu.data.sem_dados", true)

            dados_conhecidos = `**${client.tls.phrase(user, "manu.data.ranking_guilds")}:**\`\`\`fix\n${lista_servidores(ranking, 250, client)}\`\`\``

            // Listando as redes linkadas
            if (user.social) {
                dados_conhecidos += '\n:globe_with_meridians: **Links externos: **\n'

                if (user?.social.steam)
                    dados_conhecidos += `\`Steam\`, `

                if (user?.social.lastfm)
                    dados_conhecidos += `\`LastFM\`, `

                if (user?.social.pula_predios)
                    dados_conhecidos += `\`Pula prédios\``
            }

            const id_badges = await client.getBadges(user.uid)

            if (id_badges.length > 0)
                dados_conhecidos += `\n\n**Badges:**\n${await buildAllBadges(client, user, id_badges)}`

            const embed = new EmbedBuilder()
                .setTitle(client.tls.phrase(user, "manu.data.dados_conhecidos"))
                .setColor(client.embed_color(user.misc.color))
                .setDescription(`${client.tls.phrase(user, "manu.data.resumo_dados")}\n\n${dados_conhecidos}`)
                .setFooter({ text: client.tls.phrase(user, "manu.data.dica_rodape") })

                .addFields(
                    {
                        name: `${valida_valor(user?.conf.ghost_mode)} **Modo fantasma**`,
                        value: "⠀",
                        inline: true
                    },
                    {
                        name: `${valida_valor(user?.conf.notify)} **Notificações em DM**`,
                        value: "⠀",
                        inline: true
                    },
                    {
                        name: `${valida_valor(user?.conf.ranking)} **Ranking ativo**`,
                        value: "⠀",
                        inline: true
                    }
                )

            interaction.reply({ embeds: [embed], ephemeral: true })

        } else { // Exclui os dados do usuário coletados pelo bot

            const opcoes = [1, 2, 3, 4]

            interaction.reply({ content: "Escolha uma das opções abaixo", components: [create_menus("data", client, interaction, user, opcoes)], ephemeral: user?.conf.ghost_mode || false })
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
            nome_servidores = `${nome_servidores} ${client.tls.phrase(user, "manu.data.outros_servers").replace("server_repl", servidores_restantes)}`
        else
            nome_servidores = `${nome_servidores} ${client.tls.phrase(user, "manu.data.um_server")}`
    }

    return nome_servidores
}

function valida_valor(valor) {

    let retorno = ":white_check_mark:"

    if (typeof valor !== "undefined" && valor !== null)
        if (valor)
            retorno = ":white_check_mark:"
        else
            retorno = ":no_entry:"

    return retorno
}