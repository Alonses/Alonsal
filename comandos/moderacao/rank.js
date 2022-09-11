const { existsSync, writeFileSync } = require("fs")
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('xp')
        .setDescription("⌠💂⌡ Ajuste o XP de algum usuário")
        .addUserOption(option =>
            option.setName('usuario')
            .setDescription("O usuário a ser ajustar")
            .setRequired(true))
        .addNumberOption(option =>
            option.setName('xp')
            .setDescription('Qual o novo XP?')
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.ManageChannels | PermissionFlagsBits.Administrator),
	async execute(client, interaction) {

        const { moderacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
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
    }
}