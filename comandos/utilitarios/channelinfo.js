const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

const diff_datas = require('../../adm/funcoes/diff_datas.js')
const formata_data = require('../../adm/funcoes/formata_data.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('channelinfo')
		.setDescription('⌠💡⌡ Veja detalhes de algum canal')
        .addChannelOption(option => option.setName('canal').setDescription('Marque outro canal como alvo')),
	async execute(client, interaction) {

        const idioma_definido = client.idioma.getLang(interaction)
        const { utilitarios } = require(`../../arquivos/idiomas/${idioma_definido}.json`)

        let canal = interaction.options.getChannel('canal') || interaction.channel
        // Coletando os dados do canal informado
        
        let nsfw = utilitarios[9]["nao"]
        if (canal.nsfw)
            nsfw = utilitarios[9]["sim"]
        
        const data_atual = new Date()
        const data_criacao = formata_data(new Date(canal.createdAt), idioma_definido == "al-br" ? "pt-br" : idioma_definido) // Criação do canal
        const diferenca_criacao = diff_datas(new Date(canal.createdAt), data_atual, utilitarios)
        let userlimit, bitrate = ""

        let topico = `\`\`\`${canal.topic}\`\`\``
        if (!canal.topic)
            topico = `\`\`\`${utilitarios[15]["sem_topico"]}\`\`\``
        
        if (typeof canal.bitrate !== "undefined"){
            topico = `\`\`\`🔊 ${utilitarios[15]["canal_voz"]}\`\`\``

            userlimit = canal.userLimit

            if (userlimit === 0)
                userlimit = utilitarios[15]["sem_limite"]

            bitrate = `${canal.bitrate / 1000}kbps`
        }

        let icone_server = canal.guild.iconURL({ size: 2048 })
        icone_server = icone_server.replace(".webp", ".gif")

        fetch(icone_server)
        .then(res => {
            if (res.status !== 200)
                icone_server = icone_server.replace('.gif', '.webp')

            const infos_ch = new EmbedBuilder()
                .setAuthor({ name: canal.name, iconURL: icone_server })
                .setColor(0x29BB8E)
                .setDescription(topico)
                .addFields(
                    {
                        name: `:globe_with_meridians: **${utilitarios[15]["id_canal"]}**`,
                        value: `\`${canal.id}\``,
                        inline: true
                    },
                    {
                        name: `:label: **${utilitarios[15]["mencao"]}**`,
                        value: `\`<#${canal.id}>\``,
                        inline: true
                    },
                )

            if (bitrate === "")
                infos_ch.addFields(
                    { 
                        name: ':underage: NSFW',
                        value: `\`${nsfw}\``,
                        inline: true
                    }
                )
            else
                infos_ch.addFields({  name: '⠀', value: '⠀', inline: true })

            infos_ch.addFields(
                { 
                    name: `:birthday: ${utilitarios[12]["criacao"]}`,
                    value: `${data_criacao}\n [ \`${diferenca_criacao}\` ]`,
                    inline: true
                }
            )
            .setFooter({ text: `${utilitarios[15]["servidor"]}: ${canal.guild.name}`, iconURL: interaction.user.avatarURL({ dynamic:true }) })
            
            if (typeof canal.bitrate !== "undefined")
                infos_ch.addFields(
                    { 
                        name: `:mega: ${utilitarios[15]["transmissao"]}`,
                        value: `:radio: **Bitrate: **\`${bitrate}\`\n:busts_in_silhouette: **Max. users: **\`${userlimit}\``,
                        inline: true
                    }
                )

            if (typeof canal.rateLimitPerUser !== "undefined")
                if (canal.rateLimitPerUser > 0)
                    infos_ch.addFields(
                        { 
                            name: `:name_badge: ${utilitarios[15]["modo_lento"]}`,
                            value: `\`${canal.rateLimitPerUser} segundos\``,
                            inline: true
                        }
                    )
            
            return interaction.reply({embeds: [infos_ch]})
        })
    }
}