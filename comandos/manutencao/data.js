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

                    ranking.push(nome_server)
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
            ranking_servidores = `**Ranking nos seguintes servidores:**\`\`\`fix\n${lista_servidores(ranking, 250)}\`\`\``

            const embed = new EmbedBuilder()
            .setTitle("> Seus dados conhecidos")
            .setColor(0x29BB8E)
            .setDescription(`Este é um resumo dos dados que salvamos de você\n\n${ranking_servidores}`)
            .setFooter({ text: 'Você pode excluir todos os seus dados com o comando /data excluir'})

            interaction.reply({ embeds: [embed], ephemeral: true })
        }
    }
}

function lista_servidores(servidores, linha_corte){

    let nome_servidores = servidores.join(", ")

    if(nome_servidores.length > linha_corte){

        let i = linha_corte
        nome_interno = nome_servidores.slice(0, linha_corte)
        do{
            nome_interno = nome_servidores.slice(0, i)
            
            i += 1
        }while(!nome_interno.includes(", "))

        nome_servidores = nome_interno
        ultima_posicao = nome_servidores.lastIndexOf(", ")

        // Quantidade de servidores listados anteriormente
        qtd_servidores = (nome_servidores.match(/,/g) || []).length
        
        nome_servidores = nome_servidores.slice(0, ultima_posicao)
        servidores_restantes = servidores.length - qtd_servidores

        if(servidores_restantes > 1)
            nome_servidores = `${nome_servidores} e outros ${servidores_restantes} servidores`
        else
            nome_servidores = `${nome_servidores} e 1 outro servidor`
    }

    return nome_servidores
}