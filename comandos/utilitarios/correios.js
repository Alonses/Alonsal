const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder, Utils } = require("discord.js")


// QI518312458BR
module.exports = {
    data: new SlashCommandBuilder()
        .setName('rastreio')
        .setDescription('⌠💡|🇧🇷⌡ Rastrear um pacote no Correios')
        .addStringOption(option =>
            option.setName('codigo')
                .setDescription('O código do pacote')
                .setRequired(true)),
    async execute(client, interaction) {

        let idioma_definido = client.idioma.getLang(interaction)
        idioma_definido = idioma_definido == "al-br" ? "pt-br" : idioma_definido

        const { utilitarios } = require(`../../arquivos/idiomas/${idioma_definido}.json`)
        const texto_entrada = interaction.options.data[0].value

        fetch(`https://proxyapp.correios.com.br/v1/sro-rastro/${texto_entrada}`)
            .then(res => res.json())
            .then(result => {

                const objeto = result.quantidade == 1 ? result.objetos[0] : result.objetos
                const user = client.usuarios.getUser(interaction.user.id)

                const eventos_transp = []

                if (objeto.eventos) {
                    let eventos = objeto.eventos

                    for (let i = 0; i < eventos.length && i < 5; i++) {

                        let data_evento = new Date(eventos[i].dtHrCriado).getTime() / 1000
                        let datas_eventos = ""

                        if (new Date().getTime() / 1000 - data_evento < 1209600)
                            datas_eventos = `<t:${data_evento}:R> | `

                        datas_eventos += `<t:${data_evento}:F>`
                        let local = `\`${eventos[i].unidade.endereco.cidade} | ${eventos[i].unidade.tipo}\``

                        eventos_transp.push(`${emoji_status(eventos[i].urlIcone)} | ${eventos[i].descricao}\n${utilitarios[21]["local"]}: ${local}\n${datas_eventos}\n`)
                    }
                }

                let titulo = `> ${utilitarios[21]["objeto_rastreado"]} :package:`, nota_rodape = "", objeto_nao_encontrado = ""

                if (objeto.mensagem) {
                    objeto_nao_encontrado = `\`\`\`${objeto.mensagem.split(":")[1]}\`\`\``
                    titulo = `> ${utilitarios[21]["objeto_invalido"]} :warning:`
                    nota_rodape = utilitarios[21]["codigo_invalido"]
                }

                const embed = new EmbedBuilder()
                    .setTitle(titulo)
                    .setColor(user.color)
                    .setDescription(`${objeto_nao_encontrado}${eventos_transp.join("\n")}\n:label: **${utilitarios[21]["codigo"]}:** \`${texto_entrada}\``)

                if (nota_rodape.length > 1)
                    embed.setFooter({ text: nota_rodape, iconURL: interaction.user.avatarURL({ dynamic: true }) })

                return interaction.reply({ embeds: [embed], ephemeral: true })
            })
    }
}

function emoji_status(urlIcone) {

    urlIcone = urlIcone.split('/public-resources/img/')[1].split("-")[0].split(".png")[0]

    const status = {
        caminhao: ":truck:",
        pre: ":incoming_envelope:",
        smile: ":mailbox_with_mail:",
        verificar: ":passport_control:",
        brazil: ":flag_br:",
        agencia: ":office:"
    }

    return status[urlIcone]
}