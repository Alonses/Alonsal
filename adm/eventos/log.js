const { EmbedBuilder } = require('discord.js')

const formata_horas = require('../formatadores/formata_horas.js')

module.exports = async ({ client, interaction }) => {

    if (client.x.relatorio) {
        const bot = await client.getBot()
        bot.persis.commands++
        await bot.save()

        qtd_comandos = bot.persis.commands

        const d = new Date()
        const day = d.toLocaleString("en-US", { weekday: "long" })

        let url_ativacao = `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id}`
        let min = formata_horas(d.getMinutes()), hr = formata_horas(d.getHours())

        let ampm = "am"
        if (hr > 12) {
            hr -= 12
            ampm = "pm"
        }

        let comando_inserido = interaction.commandName, entradas = []
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

        const date = d.getDate(), year = d.getFullYear()
        const month = d.toLocaleString("en-US", { month: "long" })

        const embed = new EmbedBuilder()
            .setTitle("> ✨ New interaction")
            .setColor(0x29BB8E)
            .setDescription(`:globe_with_meridians: ( \`${interaction.guild.id}\` | \`${interaction.guild.name}\` )\n\`\`\`fix\n📝 /${comando_inserido}\`\`\`\n:notepad_spiral: Command N° ( \`${client.locale(qtd_comandos)}\` )`)
            .setFooter({ text: `⏰ Time/date: ${hr}:${min}${ampm} | ${day} - ${date} ${month} ${year}` })

        if (url_ativacao !== "")
            embed.setURL(`${url_ativacao}`)

        // Envia um log de telemetria com o comando disparado
        client.notify(process.env.channel_command, embed)
    }

    const message = interaction, caso = "comando"
    await require('../data/ranking')({ client, message, caso })
}