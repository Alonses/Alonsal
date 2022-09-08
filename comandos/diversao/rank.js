const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const fs = require('fs')
const { readdirSync, existsSync, writeFileSync } = require("fs")
const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')
const busca_emoji = require("../../adm/funcoes/busca_emoji")
const busca_badges = require('../../adm/funcoes/busca_badges')

const medals = {
    0: ":first_place:",
    1: ":second_place:",
    2: ":third_place:"
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('⌠😂⌡ Veja o ranking do servidor')
        .addSubcommand(subcommand =>
            subcommand.setName('server')
            .setDescription('⌠😂⌡ Veja o ranking do servidor')
            .addStringOption(option =>
                option.setName('pagina')
                    .setDescription('Uma página para exibir'))
            .addUserOption(option =>
                option.setName('usuario')
                    .setDescription('O Usuário para exibir')))
        .addSubcommand(subcommand =>
            subcommand.setName('global')
            .setDescription('⌠😂⌡ Veja o ranking global')
            .addStringOption(option =>
                option.setName('pagina')
                    .setDescription('Uma página para exibir')))
        .addSubcommand(subcommand =>
            subcommand.setName('xp')
                .setDescription("⌠😂⌡ Ajuste o XP de algum usuário")
                .addUserOption(option =>
                    option.setName('usuario')
                    .setDescription("O usuário para ajustar")
                    .setRequired(true))
                .addNumberOption(option =>
                    option.setName('xp')
                    .setDescription('Qual o novo XP?')
                    .setRequired(true))),
	async execute(client, interaction) {
        
        let usuario_alvo = []
        const emoji_ceira = busca_emoji(client, emojis.mc_honeycomb)
        
        const { diversao, moderacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const users = []

        let rodape = interaction.user.username, user_alvo = interaction.options.getUser('usuario') // Coleta o ID do usuário mencionado
        let opcoes = interaction.options.data, pagina = 1

        if (interaction.options.getSubcommand() === "server") { // Exibindo o rank normalmente
            // Filtrando os valores de entrada caso tenham sido declarados
            opcoes.forEach(valor => {
                if (valor.name == "pagina")
                    pagina = valor.value < 1 ? 1 : valor.value
            })
            
            for (const file of readdirSync(`./arquivos/data/rank/${interaction.guild.id}`)) {
                users.push(require(`../../arquivos/data/rank/${interaction.guild.id}/${file}`))
            }

            users.sort(function (a, b) { // Ordena os usuários em ordem decrescente
                return (a.xp < b.xp) ? 1 : ((b.xp < a.xp) ? -1 : 0)
            })

            users.sort()

            const usernames = [], experiencias = [], levels = []

            const pages = users.length / 6
            let paginas = pages - Math.floor(pages) > 0.5 ? Math.floor(pages) + 1 : Math.floor(pages)
            
            if(users.length / 6 < 1)
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

                    if (existsSync(`./arquivos/data/badges/${user.id}/badges.json`))
                        fixed_badge = busca_badges(client, 'fixed', user.id)

                    if (parseInt(pagina) !== 1)
                        usernames.push(`:bust_in_silhouette: \`${(user.nickname).replace(/ /g, "")}\` ${fixed_badge}`)
                    else
                        usernames.push(`${medals[i] || ":medal:"} \`${(user.nickname).replace(/ /g, "")}\` ${fixed_badge}`)
                    
                    experiencias.push(`\`${formata_num(user.xp.toFixed(2))}\``)
                    levels.push(`\`${formata_num(Math.floor(user.xp / 1000))}\` - \`${((user.xp % 1000) / 1000).toFixed(2)}%\``)
                }

                if (!user_alvo) // Verifica se a entrada é um ID
                    i++
            }

            let embed, img_embed

            fs.readFile('./arquivos/data/ranking/ranking.txt', 'utf8', function(err, data) {
                if (!user_alvo) { // Sem usuário alvo definido
                    embed = new EmbedBuilder()
                    .setTitle(`${diversao[8]["rank_sv"]} ${interaction.guild.name}`)
                    .setColor(0x29BB8E)
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
                    .setFooter({ text: rodape, iconURL: interaction.user.avatarURL({dynamic: true}) })

                    img_embed = interaction.guild.iconURL({ size: 2048 }).replace(".webp", ".gif")
                } else { // Com usuário alvo definido

                    if (usuario_alvo.length === 0)
                        usuario_alvo.push(0)

                    let fixed_badge = ""

                    if (existsSync(`./arquivos/data/badges/${user_alvo.id}/badges.json`))
                        fixed_badge = busca_badges(client, 'fixed', user_alvo.id)

                    embed = new EmbedBuilder()
                    .setTitle(`${user_alvo.username} ${fixed_badge}`)
                    .setColor(0x29BB8E)
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.avatarURL({dynamic: true}) })

                    embed.addFields(
                        { 
                            name: `:postal_horn: ${diversao[8]["experiencia"]}`, 
                            value: `\`${usuario_alvo[0].toFixed(2)}\``, 
                            inline: true 
                        },
                        { 
                            name: `:beginner: ${diversao[8]["nivel"]}`, 
                            value: `\`${formata_num(parseInt(usuario_alvo[0] / 1000))}\` - \`${((usuario_alvo[0] % 1000) / 1000).toFixed(2)}%\``, 
                            inline: true 
                        },
                        { name: "⠀", value: "⠀", inline: true}
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
        } else if (interaction.options.getSubcommand() === "xp") { // Alterando o XP do usuário informado
            const membro_sv = interaction.guild.members.cache.get(interaction.user.id)

            if (!membro_sv.permissions.has(PermissionsBitField.Flags.Administrator) && interaction.user.id !== "665002572926681128")
                return interaction.reply({ content: 'Você não tem permissão para fazer isso!', ephemeral: true })

            const usuario = interaction.options.getUser('usuario')

            const user = {
                id: usuario.id,
                nickname: usuario.username,
                lastValidMessage: 0,
                warns: 0,
                caldeira_de_ceira: false,
                xp: 0
            }

            if (existsSync(`./arquivos/data/rank/${interaction.guild.id}/${user.id}.json`)) {
                delete require.cache[require.resolve(`../../arquivos/data/rank/${interaction.guild.id}/${user.id}.json`)]
                const { xp, lastValidMessage, warns, caldeira_de_ceira } = require(`../../arquivos/data/rank/${interaction.guild.id}/${user.id}.json`)
                user.xp = xp
                user.warns = warns
                user.lastValidMessage = lastValidMessage
                user.caldeira_de_ceira = caldeira_de_ceira
            }

            let novo_exp = parseFloat(interaction.options.get('xp').value)

            user.xp = parseFloat(novo_exp)
            novo_nivel = parseFloat(novo_exp / 1000)

            try{
                writeFileSync(`./arquivos/data/rank/${interaction.guild.id}/${user.id}.json`, JSON.stringify(user))
                delete require.cache[require.resolve(`../../arquivos/data/rank/${interaction.guild.id}/${user.id}.json`)]
            }catch(err){
                console.log(err)
                return message.reply(`:octagonal_sign: | ${moderacao[8]["error_2"]}`)
            }

            interaction.reply({ content: `:military_medal: | ${moderacao[8]["sucesso"].replace("nick_repl", user.nickname).replace("exp_repl", novo_exp.toFixed(2)).replace("nivel_repl", novo_nivel.toFixed(2))}`, ephemeral: true })
        } else
            interaction.reply({ content: 'Um comando bem enceirado vem aí...', ephemeral: true })
    }
}

function formata_num(valor) {
    return parseFloat(valor).toLocaleString('pt-BR')
}