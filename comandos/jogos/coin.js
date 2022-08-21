const { SlashCommandBuilder } = require('discord.js')
const busca_emoji = require('../../adm/funcoes/busca_emoji')
const { emojis, emojis_dancantes } = require('../../arquivos/json/text/emojis.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coin')
		.setDescription('⌠🎲⌡ Jogue cara ou coroa')
        .addStringOption(option =>
            option.setName('escolha')
                .setDescription('Cara ou coroa?')
                .setRequired(true)),
	async execute(client, interaction) {

        const idioma_definido = client.idioma.getLang(interaction)
        const { jogos } = require(`../../arquivos/idiomas/${idioma_definido}.json`)

        const escolha = (interaction.options.data[0].value).toLowerCase()
        let possibilidades = ["cara", "coroa"]

        if(escolha !== "cara" && escolha !== "coroa") return interaction.reply(jogos[1]["aviso_1"])
        
        const emoji_epic_embed_fail = busca_emoji(client, emojis.epic_embed_fail2)
        const emoji_dancando = busca_emoji(client, emojis_dancantes)

        const moeda = Math.round(Math.random())
        let emoji_exib = ":coin:", resultado
        
        if(moeda === 1)
            emoji_exib = ":crown:"

        if(escolha === possibilidades[moeda]){ // Acertou
            resultado = `[ ${emoji_exib} ] Deu ${escolha}! Você acertou! ${emoji_dancando}`

            if(idioma_definido === "en-us")
                resultado = `[ ${emoji_exib} ] It gave ${escolha}! You're right! ${emoji_dancando}`
        }else{
            resultado = `[ ${emoji_exib} ] Deu ${possibilidades[moeda]}, perdeu playboy ${emoji_epic_embed_fail}`

            if(idioma_definido === "en-us")
                resultado = `[ ${emoji_exib} ] It gave ${possibilidades[moeda]}, You missed ${emoji_epic_embed_fail}`
        }

        return interaction.reply(resultado)
    }
}