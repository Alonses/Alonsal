const { EmbedBuilder } = require('discord.js')
const fs = require('fs')

const formata_horas = require('../formatadores/formata_horas.js')

module.exports = async ({ client, interaction }) => {

    fs.readFile('./arquivos/data/ativacoes.txt', 'utf8', function (err, data) {
        if (err) throw err

        qtd_comandos = parseInt(data)
        qtd_comandos++

        if (client.id() === process.env.client_1) {
            const d = new Date()
            const day = d.toLocaleString('en-US', { weekday: 'long' })

            let url_ativacao = `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id}`
            let min = formata_horas(d.getMinutes())
            let hr = formata_horas(d.getHours())

            let ampm = "am"
            if (hr > 12) {
                hr -= 12
                ampm = "pm"
            }

            let comando_inserido = interaction.commandName
            let entradas = []

            let filtrador = interaction.options.data

            filtrador.forEach(valor => {
                // Listando todos os parâmetros usados na interação
                let entrada = `${valor.name}: ⬛`
                let opcoes_internas_comando = []

                if (!valor.value)
                    entrada = valor.name

                if (valor.options) { // Opções internas da interação
                    opcoes_comando = valor.options
                    opcoes_comando.forEach(opcao => {

                        opcao_interna = `${opcao.name}: ⬛`

                        if (!opcao.value)
                            opcao_interna = ""

                        opcoes_internas_comando.push(opcao_interna)
                    })

                    // Mesclando as opções internas com o possível subcomando da interação
                    entrada = `${entrada} ${opcoes_internas_comando.join(" ")}`
                }

                entradas.push(entrada)
            })

            comando_inserido = `${comando_inserido} ${entradas.join(" ")}`

            const date = d.getDate()
            const month = d.toLocaleString('en-US', { month: 'long' })
            const year = d.getFullYear()

            let embed = new EmbedBuilder()
                .setTitle("> ✨ New interaction")
                .setColor(0x29BB8E)
                .setDescription(`:globe_with_meridians: ( \`${interaction.guild.id}\` | \`${interaction.guild.name}\` )\n\`\`\`fix\n📝 /${comando_inserido}\`\`\`\n:notepad_spiral: Command N° ( \`${qtd_comandos.toLocaleString('pt-BR')}\` )`)
                .setFooter({ text: `⏰ Time/date: ${hr}:${min}${ampm} | ${day} - ${date} ${month} ${year}` })

            if (url_ativacao !== "")
                embed.setURL(`${url_ativacao}`)

            client.discord.channels.cache.get('846151364492001280').send({ embeds: [embed] }) // Envia o log com os comandos do usuário
        }

        fs.writeFile('./arquivos/data/ativacoes.txt', parseInt(qtd_comandos, 10).toString(), (err) => {
            if (err) throw err
        })
    })

    // Contabilizar os comandos
    if (client.id() === process.env.client_1) {
        // await require('../command_ranking.js')({client, interaction, content})

        const caso = "comando"
        await require('../automaticos/relatorio.js')({ client, caso })

        const message = interaction
        await require('../data/ranking.js')({ client, message, caso })
    }
}