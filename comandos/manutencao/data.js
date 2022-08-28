const { readdirSync, unlinkSync } = require("fs")
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('data')
		.setDescription('⌠📡⌡ Tudo o que sabemos sobre você')
        .addBooleanOption(option =>
            option.setName("excluir")
            .setDescription("Solicitar a exclusão de seus dados no Alonsal")),
    async execute(client, interaction) {
        
        const solicitar_exclusao = interaction.options.data
        let exclusao = false

        if(solicitar_exclusao.length > 0)
            exclusao = interaction.options.data[0].value

        const ranking = []
    
        for (const folder of readdirSync(`./arquivos/data/rank/`)){
            for (const file of readdirSync(`./arquivos/data/rank/${folder}`).filter(file => file.endsWith('.json'))) {
                if (file.includes(interaction.user.id)){
                    
                    let server = client.guilds.cache.get(folder)
                
                    if (!server)
                        nome_server = "servidor desconhecido"
                    else
                        nome_server = server.name

                    ranking.push(`Ranking em ${nome_server}`)
                }
            }
        }

        if(ranking.length < 1)
            return interaction.reply({ content: "Você não possui dados salvos por aqui ;)", ephemeral: true })

        if(exclusao){ // Excluindo os dados do usuário do bot
            for (const folder of readdirSync(`./arquivos/data/rank/`)){
                for (const file of readdirSync(`./arquivos/data/rank/${folder}`).filter(file => file.endsWith('.json'))) {
                    if (file.includes(interaction.user.id))
                        unlinkSync(`./arquivos/data/rank/${folder}/${file}`)
                }
            }

            interaction.reply({ content: `Seus dados foram removidos do ${client.user.username}`, ephemeral: true })
        }else{
            const embed = new EmbedBuilder()
            .setTitle("> Seus dados conhecidos")
            .setColor(0x29BB8E)
            .setDescription(`Este é um resumo dos dados que salvamos de você\`\`\`fix\n${ranking.join("\n")}\`\`\``)
            .setFooter({ text: 'Você pode solicitar a exclusão dos seus dados com o comando /data excluir'})

            interaction.reply({ embeds: [embed], ephemeral: true })
        }
    }
}