const { version } = require('../../config.json')
const { EmbedBuilder } = require('discord.js')

module.exports = async ({client}) => {

    if(client.user.id === "833349943539531806"){

        const canais_texto = client.channels.cache.filter((c) => c.type === 0).size
        const canais_voz = client.channels.cache.filter((c) => c.type === 2).size
        let members = 0
        
        client.guilds.cache.forEach(async guild => {
            members += guild.memberCount - 1
        })

        const embed = new EmbedBuilder()
        .setTitle(':steam_locomotive: Caldeiras aquecidas')
        .setColor(0x29BB8E)
        .addFields(
            {
                name: ':globe_with_meridians: **Servidores**', 
                value: `**Ativo em: **\`${client.guilds.cache.size}\``, 
                inline: true 
            },
            {
                name: ':card_box: **Canais**', 
                value: `**Observando: **\`${canais_texto}\`\n**Falando em: ** \`${canais_voz}\``, 
                inline: true 
            },
            {
                name: ':busts_in_silhouette: **Usuários**', 
                value: `**Escutando: **\`${members}\``, 
                inline: true 
            }
        )
        .addFields({name: ':white_small_square: Versão', value: `\`${version}\``, inline: false })
        .setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic: true })})
        
        client.channels.cache.get('854695578372800552').send({ embeds: [embed] }) // Avisa que está online em um canal
        
        client.user.setActivity('Faites chauffer la vapeur!', 'COMPETING')
        const activities = [
            "/idioma | French now!",
            `comandos em barra`,
            "wardens para cima",
            "barras de atalhos",
            "pula prédios",
            "ceira em barras",
            "me marca aí!",
        ]

        let i = 0
        setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`), 10000)
    }else
        client.user.setPresence({ activities: [{ name: 'baidu nos servidores' }] })

    require('./relata.js')({client})
    require('./anuncia.js')({client})
}