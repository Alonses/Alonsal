const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const formata_texto = require('../../adm/formatadores/formata_texto.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('history')
        .setDescription('⌠💡|🇧🇷⌡ Fatos que ocorreram no mundo em determinada data')
        .addSubcommand(subcommand =>
            subcommand
                .setName('unico')
                .setDescription('⌠💡|🇧🇷⌡ Apenas um acontecimento')
                .addStringOption(option =>
                    option.setName('data')
                        .setDescription('Uma data específica, neste formato 21/01'))
                .addStringOption(option =>
                    option.setName('especifico')
                        .setDescription('1, 2, 3...')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('lista')
                .setDescription('⌠💡|🇧🇷⌡ Listar todos os acontecimentos do dia')
                .addStringOption(option =>
                    option.setName('data')
                        .setDescription('Uma data específica, neste formato 21/01'))),
    async execute(client, interaction) {

        const { utilitarios } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        
        let data = ""

        await interaction.deferReply()

        if (interaction.options.getSubcommand() === "lista") { // Lista de eventos

            if (interaction.options.data[0].options.length > 0) // Data customizada
                data = `?data=${interaction.options.data[0].options[0].value}`

            fetch(`https://apisal.herokuapp.com/history${data}`)
                .then(response => response.json())
                .then(async res => {

                    if (res.status)
                        return interaction.editReply({ content: "Não há acontecimentos para esses valores especificados, tente novamente", ephemeral: true })

                    let lista_eventos = "", data_eventos = ""
                    const ano_atual = new Date().getFullYear()

                    for (let i = 0; i < res.length; i++) {
                        lista_eventos += `\`${i + 1}\` - [ \`${utilitarios[10]["em"]} ${res[i].ano}\` | \``

                        ano_atual - res[i].ano > 1 ? lista_eventos += `${utilitarios[10]["ha"]} ${ano_atual - res[i].ano}${utilitarios[14]["anos"]}\` ] ` : ano_atual - res[i].ano == 1 ? lista_eventos += `${utilitarios[10]["ano_passado"]}\` ] ` : lista_eventos += `${utilitarios[10]["este_ano"]}\` ] `

                        lista_eventos += `${res[i].acontecimento}\n`
                    }

                    lista_eventos = formata_texto(lista_eventos)

                    if (data == "") data = utilitarios[10]["hoje"]

                    data_eventos = ` ${data}`
                    const user = client.usuarios.getUser(interaction.user.id)

                    const embed_eventos = new EmbedBuilder()
                        .setTitle(utilitarios[10]["acontecimentos_1"])
                        .setAuthor({ name: "History", iconURL: "https://1000marcas.net/wp-content/uploads/2021/04/History-Channel-Logo-1536x960.png" })
                        .setColor(user.misc.embed)
                        .setDescription(`${utilitarios[10]["acontecimentos_2"]} ${data_eventos.replace("?data=", "")}\n${lista_eventos}`)

                    interaction.editReply({ embeds: [embed_eventos] })
                })
        } else { // Um acontecimento aleatório

            let especifico = "acon=alea"
            let opcoes = interaction.options.data[0].options

            // Filtrando os valores de entrada caso tenham sido declarados
            opcoes.forEach(valor => {

                if (valor.name == "data")
                    data = `data=${valor.value}`

                if (valor.name == "especifico")
                    especifico = `acon=${valor.value}`
            })

            if (data.length > 0)
                especifico = `&${especifico}`

            // Requisitando o acontecimento
            fetch(`https://apisal.herokuapp.com/history?${data}${especifico}`)
                .then(response => response.json())
                .then(async res => {

                    if (res.status)
                        return interaction.reply({ content: "Não há acontecimentos para esses valores especificados, tente novamente", ephemeral: true })

                    const acontecimento = new EmbedBuilder()
                        .setTitle(formata_texto(res.acontecimento))
                        .setAuthor({ name: "History", iconURL: "https://1000marcas.net/wp-content/uploads/2021/04/History-Channel-Logo-1536x960.png" })
                        .setURL(res.fonte)
                        .setColor(user.misc.embed)
                        .setDescription(res.descricao)
                        .setFooter({ text: res.data_acontecimento, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                        .setImage(res.imagem)

                    interaction.editReply({ embeds: [acontecimento] })
                })
                .catch(() => {
                    interaction.editReply({ content: "Houve um erro com este :x", ephemeral: true })
                })
        }
    }
}