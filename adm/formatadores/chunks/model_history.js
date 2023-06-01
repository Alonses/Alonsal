const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { EmbedBuilder } = require('discord.js')

const formata_texto = require('../formata_texto.js')

module.exports = async (client, user, dados, interaction) => {

    if (!dados)
        dados = ""

    if (typeof dados !== "object") {

        fetch(`${process.env.url_apisal}/history${dados}`)
            .then(response => response.json())
            .then(async res => {

                if (res.status)
                    if (interaction)
                        return interaction.editReply({ content: client.tls.phrase(user, "util.history.sem_entradas_valor"), ephemeral: true })
                    else
                        return client.sendDM(user, { data: client.tls.phrase(user, "util.history.sem_evento") }, true)

                let lista_eventos = "", data_eventos = ""
                const ano_atual = new Date().getFullYear()

                for (let i = 0; i < res.length; i++) {
                    lista_eventos += `\`${i + 1}\` - [ \`${client.tls.phrase(user, "util.history.em")} ${res[i].ano}\` | \``

                    ano_atual - res[i].ano > 1 ? lista_eventos += `${client.tls.phrase(user, "util.history.ha")} ${ano_atual - res[i].ano}${client.tls.phrase(user, "util.unidades.anos")}\` ] ` : ano_atual - res[i].ano === 1 ? lista_eventos += `${client.tls.phrase(user, "util.history.ano_passado")}\` ] ` : lista_eventos += `${client.tls.phrase(user, "util.history.este_ano")}\` ] `

                    lista_eventos += `${res[i].acontecimento}\n`
                }

                lista_eventos = formata_texto(lista_eventos)

                if (dados === "") dados = client.tls.phrase(user, "util.history.hoje")

                data_eventos = ` ${dados}`

                const embed_eventos = new EmbedBuilder()
                    .setTitle(client.tls.phrase(user, "util.history.acontecimentos_1"))
                    .setAuthor({ name: "History", iconURL: "https://1000marcas.net/wp-content/uploads/2021/04/History-Channel-Logo-1536x960.png" })
                    .setColor(client.embed_color(user.misc.color))
                    .setDescription(`${client.tls.phrase(user, "util.history.acontecimentos_2")} ${data_eventos.replace("?data=", "")}\n${lista_eventos}`)

                if (interaction)
                    return interaction.editReply({ embeds: [embed_eventos], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
                else
                    return client.sendDM(user, { embed: embed_eventos }, true)
            })
    } else {

        // Requisitando o acontecimento
        fetch(`${process.env.url_apisal}/history?${dados.data}${dados.especifico}`)
            .then(response => response.json())
            .then(async res => {

                if (res.status)
                    if (interaction)
                        return interaction.editReply({ content: client.tls.phrase(user, "util.history.sem_entradas_valor"), ephemeral: true })
                    else
                        return client.sendDM(user, { data: client.tls.phrase(user, "util.history.sem_evento") }, true)

                const row = client.create_buttons([{ name: "Ver mais detalhes", value: res.fonte, type: 4, emoji: "🌐" }], interaction ?? "")

                const acontecimento = new EmbedBuilder()
                    .setTitle(formata_texto(res.acontecimento))
                    .setAuthor({ name: "History", iconURL: "https://1000marcas.net/wp-content/uploads/2021/04/History-Channel-Logo-1536x960.png" })
                    .setColor(client.embed_color(user.misc.color))
                    .setDescription(formata_texto(res.descricao))
                    .setImage(res.imagem)

                if (interaction)
                    acontecimento.setFooter({ text: res.data_acontecimento, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                else
                    acontecimento.setFooter({ text: res.data_acontecimento, iconURL: client.discord.user.avatarURL({ dynamic: true }) })

                if (interaction)
                    interaction.editReply({ embeds: [acontecimento], components: [row], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
                else
                    client.sendDM(user, { embed: acontecimento, components: row }, true)
            })
            .catch(() => {
                if (interaction)
                    interaction.editReply({ content: client.tls.phrase(user, "util.history.erro_eventos"), ephemeral: true })
                else
                    client.sendDM(user, { data: client.tls.phrase(user, "util.history.erro_eventos") }, true)
            })
    }
}