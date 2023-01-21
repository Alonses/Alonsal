const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const formata_horas = require('../../adm/formatadores/formata_horas')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timestamp')
        .setDescription('⌠💡⌡ Convert a date to timestamp or vice versa')
        .setDescriptionLocalizations({
            "pt-BR": '⌠💡⌡ Converta uma data para timestamp ou vice-versa',
            "es-ES": '⌠💡⌡ Convierte una fecha en una marca de tiempo o viceversa',
            "fr": '⌠💡⌡ Convertir une date en horodatage ou vice versa',
            "it": '⌠💡⌡ Converti una data in timestamp o viceversa'
        })
        .addSubcommand(subcommand =>
            subcommand
                .setName('custom')
                .setDescription('⌠💡⌡ Custom Timestamp')
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💡⌡ Timestamp customizado',
                    "es-ES": '⌠💡⌡ Marca de tiempo personalizada',
                    "fr": '⌠💡⌡ Horodatage personnalisé',
                    "it": '⌠💡⌡ Timestamp personalizzato'
                })
                .addStringOption(option =>
                    option.setName("time")
                        .setNameLocalizations({
                            "pt-BR": 'tempo',
                            "es-ES": 'tiempo',
                            "fr": 'temps',
                            "it": 'volta'
                        })
                        .setDescription("The value to be converted")
                        .setDescriptionLocalizations({
                            "pt-BR": 'O Valor a ser convertido',
                            "es-ES": 'El valor a convertir',
                            "fr": 'La valeur à convertir',
                            "it": 'Il valore da convertire'
                        }))
                .addStringOption(option =>
                    option.setName('timer')
                        .setDescription('A quick date to book')
                        .setDescriptionLocalizations({
                            "pt-BR": 'Uma data rápida para marcar',
                            "es-ES": 'Una fecha rápida para reservar',
                            "fr": 'Une date rapide à réserver',
                            "it": 'Un\'ora veloce per raccogliere'
                        })
                        .addChoices(
                            { name: '+5 M', value: '5' },
                            { name: '+10 M', value: '10' },
                            { name: '+30 M', value: '30' },
                            { name: '+1 H', value: '60' },
                            { name: '+2 H', value: '120' }
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('now')
                .setNameLocalizations({
                    "pt-BR": 'agora',
                    "es-ES": 'ahora',
                    "fr": 'present'
                })
                .setDescription('⌠💡⌡ Current timestamp')
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💡⌡ Timestamp atual',
                    "es-ES": '⌠💡⌡ Marca de tiempo actual',
                    "fr": '⌠💡⌡ Horodatage actuel'
                })),
    async execute(client, interaction) {

        const user = await client.getUser(interaction.user.id)

        let timestamp, aviso = "", conversao_invalida = false
        let titulo = client.tls.phrase(client, interaction, "util.timestamp.timestamp_1")
        let data = interaction.options.data[0].value, retorno, entrada = null, timer = 0
        let conversao_valida = ""

        if (interaction.options.getSubcommand() !== "now") { // Entrada customizada
            let opcoes = interaction.options.data[0].options

            opcoes.forEach(valor => {
                if (valor.name === "time")
                    entrada = parseInt(valor.value)

                if (valor.name === "timer")
                    timer = parseInt(valor.value) * 60
            })

            if (!entrada)
                entrada = Math.floor(Date.now() / 1000) + timer // Iniciando o timestamp 

            if (!isNaN(entrada)) {
                titulo = client.tls.phrase(client, interaction, "util.timestamp.timestamp_crono")
                retorno = entrada

                timestamp = new Date(entrada)
                timestamp = `${timestamp.getFullYear()}-${("0" + (timestamp.getMonth() + 1)).slice(-2)}-${("0" + timestamp.getDate()).slice(-2)} ${formata_horas(timestamp.getHours(), timestamp.getMinutes(), timestamp.getSeconds())}`

                conversao_invalida = false
            } else if (!entrada.includes("-")) { // De timestamp para data normal
                timestamp = new Date(Number(entrada * 1000))
                titulo = client.tls.phrase(client, interaction, "util.timestamp.timestamp_2")
                retorno = entrada

                timestamp = `${timestamp.getFullYear()}-${("0" + (timestamp.getMonth() + 1)).slice(-2)}-${("0" + timestamp.getDate()).slice(-2)} ${formata_horas(timestamp.getHours(), timestamp.getMinutes(), timestamp.getSeconds())}`

                if ((timestamp instanceof Date && !isNaN(timestamp)) || timestamp.split("-")[0] == "NaN")
                    conversao_invalida = true
            } else { // De data normal para timestamp
                timestamp = new Date(data).getTime() / 1000
                retorno = timestamp

                if (isNaN(timestamp))
                    conversao_invalida = true
            }

            if (conversao_invalida)
                conversao_valida = `\`${data}\` -> \`${timestamp}\``
        } else {
            retorno = Math.floor(Date.now() / 1000)
            titulo = client.tls.phrase(client, interaction, "util.timestamp.timestamp_now")
        }

        let dica_conversao = `\n\n( \`<t:${retorno}:R>\` ) <t:${retorno}:R>\n( \`<t:${retorno}:t>\` ) <t:${retorno}:t>\n( \`<t:${retorno}:T>\` ) <t:${retorno}:T>\n( \`<t:${retorno}:d>\` ) <t:${retorno}:d>\n( \`<t:${retorno}:D>\` ) <t:${retorno}:D>\n( \`<t:${retorno}:f>\` ) <t:${retorno}:f>\n( \`<t:${retorno}:F>\` ) <t:${retorno}:F>`

        if (conversao_invalida) {
            titulo = client.tls.phrase(client, interaction, "util.timestamp.erro_titulo")
            aviso = client.tls.phrase(client, interaction, "util.timestamp.erro_conversao")
            timestamp = client.tls.phrase(client, interaction, "util.timestamp.valor_nulo")
            dica_conversao = ""
        }

        const embed = new EmbedBuilder()
            .setTitle(titulo)
            .setColor(client.embed_color(user.misc.color))
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setDescription(`${conversao_valida}${dica_conversao}`)

        if (aviso.length > 0)
            embed.setFooter(aviso)

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}