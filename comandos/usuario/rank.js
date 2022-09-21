const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const fs = require('fs')
const { readdirSync, unlinkSync, existsSync } = require("fs")
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')
const busca_emoji = require("../../adm/discord/busca_emoji")
const busca_badges = require('../../adm/data/badges')

const medals = {
    0: ":first_place:",
    1: ":second_place:",
    2: ":third_place:"
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('⌠👤⌡ See Alonsal\'s ranking')
        .setDescriptionLocalizations({
            "pt-BR": '⌠👤⌡ Veja o ranking do Alonsal',
            "es-ES": '⌠👤⌡ Ver el ranking de Alonsal',
            "fr": '⌠👤⌡ Voir le classement d\'Alonsal'
        })
        .addSubcommand(subcommand =>
            subcommand.setName('server')
                .setDescription('⌠👤⌡ See server ranking')
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Veja o ranking do servidor',
                    "es-ES": '⌠👤⌡ Ver el ranking en el servidor',
                    "fr": '⌠👤⌡ Voir le classement des serveurs'
                })
                .addStringOption(option =>
                    option.setName('page')
                        .setNameLocalizations({
                            "pt-BR": 'pagina',
                            "es-ES": 'pagina',
                            "fr": 'page'
                        })
                        .setDescription('One page to display')
                        .setDescriptionLocalizations({
                            "pt-BR": 'Uma página para exibir',
                            "es-ES": 'Una pagina para mostrar',
                            "fr": 'Une page à afficher'
                        }))
                .addUserOption(option =>
                    option.setName('user')
                        .setNameLocalizations({
                            "pt-BR": 'usuario',
                            "es-ES": 'usuario',
                            "fr": 'user'
                        })
                        .setDescription('User to display')
                        .setDescriptionLocalizations({
                            "pt-BR": 'O Usuário para exibir',
                            "es-ES": 'Usuario a mostrar',
                            "fr": 'Utilisateur à afficher'
                        })))
        .addSubcommand(subcommand =>
            subcommand.setName('global')
                .setDescription('⌠👤⌡ See the global ranking')
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Veja o ranking global',
                    "es-ES": '⌠👤⌡ Ver el ranking mundial',
                    "fr": '⌠👤⌡ Voir le classement mondial'
                })
                .addStringOption(option =>
                    option.setName('page')
                        .setNameLocalizations({
                            "pt-BR": 'pagina',
                            "es-ES": 'pagina',
                            "fr": 'page'
                        })
                        .setDescription('One page to display')
                        .setDescriptionLocalizations({
                            "pt-BR": 'Uma página para exibir',
                            "es-ES": 'Una pagina para mostrar',
                            "fr": 'Une page à afficher'
                        }))),
    async execute(client, interaction) {

        let usuario_alvo = []

        const { diversao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const users = []

        let rodape = interaction.user.username, user_alvo = interaction.options.getUser('user') // Coleta o ID do usuário mencionado
        let opcoes = interaction.options.data, pagina = 1

        if (interaction.options.getSubcommand() === "server") { // Exibindo o rank normalmente

            // Filtrando os valores de entrada caso tenham sido declarados
            opcoes.forEach(valor => {
                if (valor.name == "page")
                    pagina = valor.value < 1 ? 1 : valor.value
            })

            for (const file of readdirSync(`./arquivos/data/rank/${interaction.guild.id}`)) {
                try {
                    const data = require(`../../arquivos/data/rank/${interaction.guild.id}/${file}`)

                    users.push(data)
                } catch (err) { // Erro na leitura do arquivo ( arquivo corrompido / Excluindo o arquivo )
                    unlinkSync(`./arquivos/data/rank/${interaction.guild.id}/${file}`)
                }
            }

            users.sort(function (a, b) { // Ordena os usuários em ordem decrescente
                return (a.xp < b.xp) ? 1 : ((b.xp < a.xp) ? -1 : 0)
            })

            users.sort()

            const usernames = [], experiencias = [], levels = []

            const pages = users.length / 6
            let paginas = pages - Math.floor(pages) > 0.5 ? Math.floor(pages) + 1 : Math.floor(pages)

            if (users.length / 6 < 1)
                paginas = 1

            if (users.length > 6)
                rodape = `( 1 | ${paginas} ) - ${paginas} ${diversao[8]["rodape"]}`

            if (!user_alvo) {
                if (pagina > paginas) // Número de página escolhida maior que as disponíveis
                    return interaction.reply({ content: `:octagonal_sign: | ${diversao[8]["error_1"]}`, ephemeral: true })

                const remover = pagina === paginas ? (pagina - 1) * 6 : users.length % 6 !== 0 ? pagina !== 2 ? (pagina - 1) * 6 : (pagina - 1) * 6 : (pagina - 1) * 6

                for (let x = 0; x < remover; x++)
                    users.shift()

                rodape = `( ${pagina} | ${paginas} ) - ${paginas} ${diversao[8]["rodape"]}`
            }

            let i = 0

            for (const user of users) {
                if (user_alvo)
                    if (user.id === user_alvo.id) {
                        usuario_alvo.push(user.xp)
                        break
                    }

                if (i < 6) {
                    let fixed_badge = "" // Procurando a Badge fixada do usuário

                    if (existsSync(`./arquivos/data/user/${user.id}.json`))
                        fixed_badge = busca_badges(client, 'fixed', user.id, interaction)

                    if (parseInt(pagina) !== 1)
                        usernames.push(`:bust_in_silhouette: \`${(user.nickname).replace(/ /g, "")}\` ${fixed_badge}`)
                    else
                        usernames.push(`${medals[i] || ":medal:"} \`${(user.nickname).replace(/ /g, "")}\` ${fixed_badge}`)

                    experiencias.push(`\`${formata_num(user.xp.toFixed(2))} EXP\``)
                    levels.push(`\`${formata_num(Math.floor(user.xp / 1000))}\` - \`${((user.xp % 1000) / 1000).toFixed(2)}%\``)
                }

                if (!user_alvo) // Verifica se a entrada é um ID
                    i++
            }

            let embed, img_embed
            let user = client.usuarios.getUser(interaction.user.id)
            const emoji_ceira = busca_emoji(client, emojis.mc_honeycomb)

            fs.readFile('./arquivos/data/rank_value.txt', 'utf8', function (err, data) {
                if (!user_alvo) { // Sem usuário alvo definido
                    embed = new EmbedBuilder()
                        .setTitle(`${diversao[8]["rank_sv"]} ${interaction.guild.name}`)
                        .setColor(user.color)
                        .setDescription(`\`\`\`fix\n${diversao[8]["nivel_descricao"]} 🎉\n-----------------------\n   >✳️> place_expX EXP <✳️<\`\`\``.replace("place_exp", parseInt(data)))
                        .addFields(
                            {
                                name: `${emoji_ceira} ${diversao[8]["enceirados"]}`,
                                value: usernames.join("\n"),
                                inline: true
                            },
                            {
                                name: `:postal_horn: ${diversao[8]["experiencia"]}`,
                                value: experiencias.join("\n"),
                                inline: true
                            },
                            {
                                name: `:beginner: ${diversao[8]["nivel"]}`,
                                value: levels.join("\n"),
                                inline: true
                            }
                        )
                        .setFooter({ text: rodape, iconURL: interaction.user.avatarURL({ dynamic: true }) })

                    img_embed = interaction.guild.iconURL({ size: 2048 }).replace(".webp", ".gif")
                } else { // Com usuário alvo definido

                    if (usuario_alvo.length === 0)
                        usuario_alvo.push(0)

                    let fixed_badge = ""
                    const user = client.usuarios.getUser(user_alvo.id)

                    if (existsSync(`./arquivos/data/user/${user_alvo.id}.json`))
                        fixed_badge = busca_badges(client, 'fixed', user_alvo.id, interaction)

                    embed = new EmbedBuilder()
                        .setTitle(`${user_alvo.username} ${fixed_badge}`)
                        .setColor(user.color)
                        .setFooter({ text: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) })

                    embed.addFields(
                        {
                            name: `:postal_horn: ${diversao[8]["experiencia"]}`,
                            value: `\`${usuario_alvo[0].toFixed(2)} EXP\``,
                            inline: true
                        },
                        {
                            name: `:beginner: ${diversao[8]["nivel"]}`,
                            value: `\`${formata_num(parseInt(usuario_alvo[0] / 1000))}\` - \`${((usuario_alvo[0] % 1000) / 1000).toFixed(2)}%\``,
                            inline: true
                        },
                        { name: "⠀", value: "⠀", inline: true }
                    )

                    img_embed = `https://cdn.discordapp.com/avatars/${user_alvo.id}/${user_alvo.avatar}.gif?size=512`
                }

                fetch(img_embed).then(res => {
                    if (res.status !== 200)
                        img_embed = img_embed.replace('.gif', '.webp')

                    embed.setThumbnail(img_embed)

                    interaction.reply({ embeds: [embed] })
                })
            })
        } else // Alterando o XP do usuário informado
            interaction.reply({ content: 'Um comando bem enceirado vem aí...', ephemeral: true })
    }
}

function formata_num(valor) {
    return parseFloat(valor).toLocaleString('pt-BR')
}