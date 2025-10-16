const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

module.exports = async ({ client, alvo, dados, interaction, user_command, internal_module }) => {

    if (interaction)
        interaction.editReply({
            content: client.tls.phrase(alvo, "util.history.erro_eventos"),
            flags: "Ephemeral"
        })
    else client.sendModule(alvo, { content: client.tls.phrase(alvo, "util.history.erro_eventos") }, internal_module)

    return

    if (!dados) dados = ""

    if (typeof dados !== "object") {

        fetch(`${process.env.url_apisal}/history${dados}`)
            .then(response => response.json())
            .then(async res => {

                if (res.status)
                    if (interaction)
                        return interaction.editReply({
                            content: client.tls.phrase(alvo, "util.history.sem_entradas_valor"),
                            flags: "Ephemeral"
                        })
                    else
                        return client.sendModule(alvo, { content: client.tls.phrase(alvo, "util.history.sem_evento") }, internal_module)

                let lista_eventos = "", data_eventos = ""
                const ano_atual = new Date().getFullYear()

                for (let i = 0; i < res.length; i++) {
                    lista_eventos += `\`${i + 1}\` - [ \`${client.tls.phrase(alvo, "util.history.em")} ${res[i].ano}\` | \``

                    ano_atual - res[i].ano > 1 ? lista_eventos += `${client.tls.phrase(alvo, "util.history.ha")} ${ano_atual - res[i].ano}${client.tls.phrase(alvo, "util.unidades.anos")}\` ] ` : ano_atual - res[i].ano === 1 ? lista_eventos += `${client.tls.phrase(alvo, "util.history.ano_passado")}\` ] ` : lista_eventos += `${client.tls.phrase(alvo, "util.history.este_ano")}\` ] `

                    lista_eventos += `${client.execute("formata_texto", { string: res[i].acontecimento })}\n`
                }

                if (dados === "") dados = client.tls.phrase(alvo, "util.history.hoje")

                data_eventos = ` ${dados}`

                const embed_eventos = client.create_embed({
                    title: { tls: "util.history.acontecimentos_1" },
                    author: {
                        name: "History",
                        iconURL: "https://1000marcas.net/wp-content/uploads/2021/04/History-Channel-Logo-1536x960.png"
                    },
                    description: `${client.tls.phrase(alvo, "util.history.acontecimentos_2")} ${data_eventos.replace("?data=", "")}\n${lista_eventos}`
                }, alvo)

                if (interaction)
                    return client.reply(interaction, {
                        embeds: [embed_eventos],
                        flags: client.decider(alvo?.conf.ghost_mode || user_command, 0) ? "Ephemeral" : null
                    }, true)
                else return client.sendModule(alvo, { embeds: [embed_eventos] }, internal_module)
            })
    } else {

        // Requisitando o acontecimento
        fetch(`${process.env.url_apisal}/history?${dados.data}${dados.especifico}`)
            .then(response => response.json())
            .then(async res => {

                if (res.status)
                    if (interaction)
                        return interaction.editReply({
                            content: client.tls.phrase(alvo, "util.history.sem_entradas_valor"),
                            flags: "Ephemeral"
                        })
                    else return client.sendModule(alvo, { content: client.tls.phrase(alvo, "util.history.sem_evento") }, internal_module)

                const row = client.create_buttons([
                    { name: { tls: "menu.botoes.mais_detalhes" }, value: res.fonte, type: 4, emoji: "🌐" }
                ], interaction, alvo)

                const acontecimento = client.create_embed({
                    title: client.execute("formata_texto", { string: res.acontecimento }),
                    author: {
                        name: "History",
                        iconURL: "https://1000marcas.net/wp-content/uploads/2021/04/History-Channel-Logo-1536x960.png"
                    },
                    image: res.imagem,
                    description: client.execute("formata_texto", { string: res.descricao })
                }, alvo)

                if (interaction)
                    acontecimento.setFooter({
                        text: res.data_acontecimento,
                        iconURL: interaction.user.avatarURL({ dynamic: true })
                    })
                else
                    acontecimento.setFooter({
                        text: res.data_acontecimento,
                        iconURL: client.avatar()
                    })

                if (interaction)
                    client.reply(interaction, {
                        embeds: [acontecimento],
                        components: [row],
                        flags: client.decider(alvo?.conf.ghost_mode || user_command, 0) ? "Ephemeral" : null
                    }, true)
                else client.sendModule(alvo, { embeds: [acontecimento], components: [row] }, internal_module)
            })
            .catch(() => {
                if (interaction)
                    interaction.editReply({
                        content: client.tls.phrase(alvo, "util.history.erro_eventos"),
                        flags: "Ephemeral"
                    })
                else client.sendModule(alvo, { content: client.tls.phrase(alvo, "util.history.erro_eventos") }, internal_module)
            })
    }
}