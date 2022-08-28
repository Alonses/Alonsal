const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { readdirSync } = require("fs")
const fs = require('fs')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')
const busca_emoji = require("../../adm/funcoes/busca_emoji")

const medals = {
    0: ":first_place:",
    1: ":second_place:",
    2: ":third_place:"
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('⌠😂⌡ Veja o ranking do servidor')
        .addStringOption(option =>
            option.setName('pagina')
                .setDescription('Uma página para exibir'))
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('O Usuário para exibir')),
	async execute(client, interaction) {
 
        let usuario_alvo = []
        const emoji_ceira = busca_emoji(client, emojis.mc_honeycomb)
        
        const { diversao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const users = []

        let rodape = interaction.user.username, user_alvo = interaction.options.getUser('usuario') // Coleta o ID do usuário mencionado
        let opcoes = interaction.options.data, pagina = 0

        // Filtrando os valores de entrada caso tenham sido declarados
        opcoes.forEach(valor => {
            if (valor.name == "pagina")
                pagina = valor.value
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
        const paginas = pages - Math.floor(pages) > 0.5 ? Math.floor(pages) + 1 : Math.floor(pages)

        if(users.length > 6)
            rodape = `( 1 | ${paginas} ) - ${paginas} ${diversao[8]["rodape"]}`
        
        let i = 0

        for (const user of users) {
            if(user_alvo)
                if(user.id === user_alvo.id){
                    usuario_alvo.push(user.xp)
                    break
                }
            
            if (i < 6) {
                if (parseInt(pagina) !== 1)
                    usernames.push(`:bust_in_silhouette: \`${(user.nickname).replace(/ /g, "")}\``)
                else
                    usernames.push(`${medals[i] || ":medal:"} \`${(user.nickname).replace(/ /g, "")}\``)
                
                experiencias.push(`\`${formata_num(user.xp)}\``)
                levels.push(`\`${formata_num(Math.floor(user.xp / 1000))}\` - \`${((user.xp % 1000) / 1000).toFixed(2)}%\``)
            }

            if(!user_alvo) // Verifica se a entrada é um ID
                i++
        }

        let embed, img_embed

        fs.readFile('./arquivos/data/ranking/ranking.txt', 'utf8', function(err, data) {
            if(!user_alvo){ // Sem usuário alvo definido
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
            }else{ // Com usuário alvo definido

                if(usuario_alvo.length === 0)
                    usuario_alvo.push(0)

                embed = new EmbedBuilder()
                .setTitle(user_alvo.username)
                .setColor(0x29BB8E)
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.avatarURL({dynamic: true}) })

                embed.addFields(
                    { 
                        name: `:postal_horn: ${diversao[8]["experiencia"]}`, 
                        value: `\`${usuario_alvo[0]}\``, 
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
                if(res.status !== 200)
                    img_embed = img_embed.replace('.gif', '.webp')

                embed.setThumbnail(img_embed)

                interaction.reply({ embeds: [embed], ephemeral: true })
            })
        })
    }
}

function formata_num(valor){
    return parseInt(valor).toLocaleString('pt-BR')
}