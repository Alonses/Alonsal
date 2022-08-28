const { SlashCommandBuilder } = require('discord.js')

const dispara_anuncio = require('../../adm/funcoes/dispara_anuncio.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('c_anunciar')
		.setDescription('⌠✳️⌡ Anúnciar games/dlcs free')
        .addStringOption(option =>
            option.setName('nome')
                .setDescription('O nome do conteúdo')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('preço')
                .setDescription('O preço do conteúdo')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('expiração')
                .setDescription('A data limite da promoção')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('link')
                .setDescription('O link do conteúdo')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('imagem')
            .setDescription("A imagem que será exibida")
            .setRequired(true))
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('O tipo do conteudo')
                .addChoices(
                    { name: 'Jogo', value: 'jogo' },
                    { name: 'DLC/Expansão', value: 'dlc' },
                ))
        .addStringOption(option =>
            option.setName('urgência')
                .setDescription('A urgência do anúncio')
                .addChoices(
                    { name: 'Normal', value: 'n' },
                    { name: 'Urgente', value: 'u' },
                )),
        async execute(client, interaction) {
            
            if (interaction.user.id !== "665002572926681128") return

            await interaction.deferReply()

            let entradas = interaction.options.data

            const objeto_anunciado = {
                nome: null,
                tipo: null,
                link: null,
                preco: null,
                expira: null,
                urgencia: null,
                thumbnail: null
            }

            entradas.forEach(valor => {
                if (valor.name == "nome")
                    objeto_anunciado.nome = valor.value
                    
                if (valor.name == "tipo")
                    objeto_anunciado.tipo = valor.value
                
                if (valor.name == "link")
                    objeto_anunciado.link = valor.value

                if (valor.name == "preço")
                    objeto_anunciado.preco = valor.value

                if (valor.name == "expiração")
                    objeto_anunciado.expira = valor.value

                if (valor.name == "urgência")
                    objeto_anunciado.urgencia = valor.value

                if (valor.name == "imagem")
                    objeto_anunciado.thumbnail = valor.attachment.attachment
            })
            
            if (objeto_anunciado.tipo == null)
                objeto_anunciado.tipo = "jogo"

            if (objeto_anunciado.urgencia == null)
                objeto_anunciado.urgencia = "n"
            
            dispara_anuncio(client, interaction, objeto_anunciado)
  	}
}