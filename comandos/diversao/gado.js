const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gado')
		.setDescription('⌠😂⌡ Teste a gadisse de alguém')
        .addUserOption(option => 
            option.setName('usuario')
            .setDescription('Marque outro usuário como alvo')
            .setRequired(true)),
	async execute(client, interaction) {

        let idioma_definido = client.idioma.getLang(interaction)
        if(idioma_definido == "al-br") idioma_definido = "pt-br"

        const { diversao } = require(`../../arquivos/idiomas/${idioma_definido}.json`)
        const { gadisissimo } = require(`../../arquivos/json/text/${idioma_definido}/gado.json`)

        const num = Math.round((gadisissimo.length - 1) * Math.random())
        const alvo = interaction.options.getUser('usuario')

        if (client.user.id === alvo.id)
            return interaction.reply(diversao[3]["error_2"]);

        if (alvo.id !== interaction.user.id)
            if (idioma_definido === "pt-br")
                interaction.reply(`O <@${alvo.id}> ${gadisissimo[num]}`);
            else
                interaction.reply(`The <@${alvo.id}> ${gadisissimo[num]}`);
        else
            if (idioma_definido === "pt-br")
                interaction.reply(`Você ${interaction.user} ${gadisissimo[num]}`);
            else
                interaction.reply(`You ${interaction.user} ${gadisissimo[num]}`)
    }
}