const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js')
const fs = require('fs')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('notify')
        .setNameLocalizations({
            "pt-BR": 'notificar',
            "fr": 'notifier'
        })
        .setDescription('⌠💂⌡ (Dis)Enable announces for free games')
        .setDescriptionLocalizations({
            "pt-BR": '⌠💂⌡ (Des)Habilitar anúncio de games free',
            "fr": '⌠💂⌡ (Dés)activer les publicités pour les jeux gratuits'
        })
        .addRoleOption(option =>
            option.setName('role')
            .setNameLocalizations({
                "pt-BR": 'cargo',
                "fr": 'role'
            })
            .setDescription('The role that will be notified')
            .setDescriptionLocalizations({
                "pt-BR": 'O cargo que será notificado',
                "fr": 'Le role qui sera notifié'
            }))
        .addChannelOption(option =>
            option.setName('channel')
            .setNameLocalizations({
                "pt-BR": 'canal',
                "fr": 'salon'
            })
            .setDescription('The channel that will be used')
            .setDescriptionLocalizations({
                "pt-BR": 'O canal que será usado',
                "fr": 'Le canal qui sera utilisé'
            }))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator)
        ,
	async execute(client, interaction) {
        
		const { moderacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const { canal_games } = require('../../arquivos/data/games/canal_games.json')
        
        const membro_sv = interaction.guild.members.cache.get(interaction.user.id)

        if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageChannels) && interaction.user.id !== "665002572926681128")
            return interaction.reply({ content: moderacao[5]["moderadores"], ephemeral: true }) // Libera configuração para proprietários e adms apenas

        let opcao_remove = false, entradas = interaction.options.data

        const notificador = {
            cargo: null,
            canal: null
        }
        
        // Coletando todas as entradas
        entradas.forEach(valor => {

            if (valor.name == "cargo")
                notificador.cargo = valor.value

            if (valor.name == "canal") {
                notificador.canal = valor.value

                if (valor.channel.type !== 0 && valor.channel.type !== 5) // Canal inválido
                    return interaction.reply({ content: `:octagonal_sign: | ${moderacao[6]["tipo_canal"]}`, ephemeral: true })
            }
        })

        if (!notificador.canal || !notificador.cargo)
            opcao_remove = "rem"
        
        const outputArray = [] // Transfere todos os dados do JSON para um array
        for (const element in canal_games) {

            const canal = canal_games[element][0]
            const cargo = canal_games[element][1]
            
            if (opcao_remove !== "rem" || element !== interaction.guild.id) { // Remove um servidor/canal da lista de clientes no json
                outputArray.push(
                    constructJson(element, [canal, cargo])
                )
            }
        }

        for (let i = 0; i < outputArray.length; i++) { // Procura pelo ID do server e altera o idioma
            const obj = outputArray[i]
            const key = Object.keys(canal_games)

            if (key[i] === interaction.guild.id && opcao_remove !== "rem") {
                obj[interaction.guild.id][0] = notificador.canal
                obj[interaction.guild.id][1] = notificador.cargo
                break
            }
        }
        
        if (opcao_remove !== "rem") // Registra o servidor caso o mesmo não esteja registrado
            outputArray.push(constructJson(interaction.guild.id, [notificador.canal, notificador.cargo]))

        let canal_servidor = JSON.stringify(outputArray, null, 4)
        canal_servidor = canal_servidor.replace("[", "")
        canal_servidor = canal_servidor.slice(0, -1)

        canal_servidor = canal_servidor.replaceAll("{", "").replaceAll("}", "")
        canal_servidor = `{ \"canal_games\" : { ${canal_servidor} } }`

        canal_servidor = JSON.parse(canal_servidor) // Ajusta o arquivo
        canal_servidor = JSON.stringify(canal_servidor, null, 4)
        
        fs.writeFile('./arquivos/data/games/canal_games.json', canal_servidor, (err) => {
            if (err) throw err
            
            let mensagem = `:video_game: | O Servidor ( \`${interaction.guild.name}\` | \`${interaction.guild.id}\` ) agora recebe atts de jogos grátis`

            if (opcao_remove === "rem")
                mensagem = `:video_game: | O Servidor ( \`${interaction.guild.name}\` | \`${interaction.guild.id}\` ) não recebe mais atts de jogos grátis`

            client.channels.cache.get('872865396200452127').send(mensagem)
        })

        delete require.cache[require.resolve('../../arquivos/data/games/canal_games.json')]
        
        let feedback_user = moderacao[6]["anuncio_games"]

        if (opcao_remove === "rem")
            feedback_user = `:mobile_phone_off: | ${moderacao[6]["anuncio_off"]}`

        interaction.reply({ content: feedback_user.replace("repl_canal", `<#${notificador.canal}>`), ephemeral: true })
    }
}

function constructJson(jsonGuild, arrayValores) {
	return { [jsonGuild] : arrayValores } 
}