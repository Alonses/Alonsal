const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { AttachmentBuilder } = require('discord.js')

const Canvas = require('@napi-rs/canvas')

module.exports = async ({ client, alvo, interaction, user_command, internal_module }) => {

    if (interaction) // Defere a interação para aumentar o tempo de resposta após
        await client.deferedReply(interaction, client.decider(alvo?.conf.ghost_mode || user_command, 0) ? "Ephemeral" : null)

    let url_pesquisa = `?idioma=${alvo.lang ?? "pt-br"}`, nota_rodape

    // Entrada customizada, ativa caso o usuário tenha pesquisado por algo
    if (interaction && interaction.options.getString("item"))
        url_pesquisa += `&item=${interaction.options.getString("item")}`

    fetch(`${process.env.url_apisal}/mine${url_pesquisa}`)
        .then(response => response.json())
        .then(async dados_item => {

            if (dados_item.status === 502) // Erro de pesquisa com a API
                if (interaction) return client.tls.editReply(interaction, alvo, "util.minecraft.error_1", true, client.emoji(0))
                else return client.sendModule(alvo, { content: client.tls.phrase(alvo, "util.minecraft.error_1", client.emoji(0)) }, internal_module)

            if (dados_item.status === 404 && interaction) // Sem item conhecido
                return client.tls.editReply(interaction, alvo, "util.minecraft.nao_encontrado", true, client.emoji("emojis_negativos"), interaction.options.getString("item"))

            let nome_item = dados_item.internal_name
            descricao_tipo = nome_item

            let colet_suv = client.tls.phrase(alvo, "util.minecraft.sim")
            let empilhavel = `${client.tls.phrase(alvo, "util.minecraft.ate")} ${dados_item.stats.stackable}`
            let renovavel = client.tls.phrase(alvo, "util.minecraft.sim")

            let tipo_item = dados_item.stats.type

            if (dados_item.stats.type === "construcao")
                tipo_item = client.tls.phrase(alvo, "util.minecraft.construcao")

            if (dados_item.type === "pocoes")
                tipo_item = client.tls.phrase(alvo, "util.minecraft.pocoes")

            if (dados_item.stats.renewable === 0)
                renovavel = client.tls.phrase(alvo, "util.minecraft.nao")

            if (dados_item.stats.stackable === 0)
                empilhavel = client.tls.phrase(alvo, "util.minecraft.nao")

            if (dados_item.stats.collectable === 0)
                colet_suv = client.tls.phrase(alvo, "util.minecraft.nao")

            let fields = { name: "⠀", value: "⠀" }
            let valores_item = ''

            if (alvo.lang !== "pt-br" && dados_item.description) {
                const traduz_descri = dados_item.description.split("\n")

                for (let k = 0; k < traduz_descri.length; k++) {

                    if (!descricao_tipo.includes("nether_star")) {
                        string_traducao = traduz_descri[k].split(":")[0]
                        alvo_json = string_traducao.replaceAll(" ", "_").normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase()
                    } else { // Traduzindo efeitos de poções e flechas
                        string_traducao = traduz_descri[k].split(" (")[0]
                        alvo_json = string_traducao.split(" ")[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase()

                        if (alvo_json.includes(":"))
                            alvo_json = alvo_json.split(":")[0]

                        nome_item += ` of ${client.tls.phrase(alvo, `util.minecraft.detalhes.${alvo_json}`)}`
                    }

                    traducao_alvo = client.tls.phrase(alvo, `util.minecraft.detalhes.${alvo_json}`)
                    valores_item = valores_item.replaceAll(string_traducao, traducao_alvo)
                }

                fields = { name: descricao_tipo, value: `\`${valores_item}\``, inline: true }
            }

            const canvas = Canvas.createCanvas(500, 150)
            const context = canvas.getContext('2d')
            const imagem = await Canvas.loadImage(dados_item.icon)

            // Removendo a suavização da imagem ao redimensionar
            context.imageSmoothingEnabled = false

            context.drawImage(imagem, 175, 0, 150, 150)
            const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: `${dados_item.internal_name}.png` })

            const embed = client.create_embed({
                title: dados_item.name,
                image: `attachment://${dados_item.internal_name}.png`,
                fields: [
                    {
                        name: `${client.emoji("mc_coracao")}** ${client.tls.phrase(alvo, "util.minecraft.coletavel")}**`,
                        value: `\`${colet_suv}\``,
                        inline: true
                    },
                    {
                        name: `${client.emoji("mc_bamboo_sign")} **${client.tls.phrase(alvo, "util.minecraft.tipo")}**`,
                        value: `\`${tipo_item}\``,
                        inline: true
                    },
                    {
                        name: `${client.emoji("mc_cyan_goat_horn")} **${client.tls.phrase(alvo, "util.minecraft.versao_add")}**`,
                        value: `\`${dados_item.stats.version}\``,
                        inline: true
                    },
                    {
                        name: `${client.emoji("mc_chest")} **${client.tls.phrase(alvo, "util.minecraft.empilhavel")}**`,
                        value: `\`${empilhavel}\``,
                        inline: true
                    },
                    {
                        name: `${client.emoji("mc_cornflower")} **${client.tls.phrase(alvo, "util.minecraft.renovavel")}**`,
                        value: `\`${renovavel}\``,
                        inline: true
                    },
                    {
                        name: `${client.emoji("mc_name_tag")} **${client.tls.phrase(alvo, "util.minecraft.nome_interno")}**`,
                        value: `**\`minecraft:${dados_item.internal_name}\`**`,
                        inline: true
                    }, fields
                ]
            }, alvo)

            if (!dados_item.stats.released) {
                nota_rodape = client.tls.phrase(alvo, "util.minecraft.nota_rodape")

                if (nota_rodape.includes("item_repl"))
                    nota_rodape = client.replace(nota_rodape, pesquisa)

                embed.setFooter({
                    text: nota_rodape
                })
            }

            if (dados_item.durability)
                embed.addFields(
                    { name: "⠀", value: "⠀", inline: true },
                    {
                        name: `${client.emoji("mc_anvil")} **${client.tls.phrase(alvo, "util.minecraft.durabilidade")}: ${dados_item.durability + 1}**`,
                        value: "⠀",
                        inline: true
                    }
                )

            // Dados vindos da wiki do minecraft
            if (dados_item.wiki.descricao) {
                const link_artigo = client.tls.phrase(alvo, "util.minecraft.mais_detalhes_wiki", null, dados_item.wiki.link)

                embed.addFields(
                    {
                        name: `${client.emoji("mc_logo_wikipedia")} ${client.tls.phrase(alvo, "util.minecraft.wiki_sobre", null, dados_item.name)}`,
                        value: `\`\`\`fix\n${client.execute("formatters", "formata_texto", (dados_item.wiki.descricao.split("\">")[0]).length > 500 ? `${(dados_item.wiki.descricao.split("\">")[0]).slice(0, 500)}...` : dados_item.wiki.descricao.split("\">")[0])}\`\`\`\n${link_artigo}`,
                        inline: false
                    }
                )
            }

            if (interaction)
                return client.reply(interaction, {
                    embeds: [embed],
                    files: [attachment],
                    flags: client.decider(alvo?.conf.ghost_mode || user_command, 0) ? "Ephemeral" : null
                }, true)
            else
                return client.sendModule(alvo, { embeds: [embed], files: [attachment], }, internal_module)
        })
} 