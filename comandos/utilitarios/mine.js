const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const formata_texto = require('../../adm/formatadores/formata_texto')
const { emojis, emojis_negativos } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mine")
        .setDescription("⌠💡⌡ Search Minecraft items")
        .setDescriptionLocalizations({
            "pt-BR": '⌠💡⌡ Pesquise itens do Minecraft',
            "es-ES": '⌠💡⌡ Buscar elementos de Minecraft',
            "fr": '⌠💡⌡ Rechercher des articles Minecraft',
            "it": '⌠💡⌡ Cerca oggetti Minecraft',
            "ru": '⌠💡⌡ Найди предметы в майнкрафте'
        })
        .addStringOption(option =>
            option.setName("item")
                .setDescription("Insert an item")
                .setDescriptionLocalizations({
                    "pt-BR": 'Insira um item',
                    "es-ES": 'Insertar un artículo',
                    "fr": 'Insérer un élément',
                    "it": 'Inserire un elemento',
                    "ru": 'поиск элемента'
                })),
    async execute(client, user, interaction) {

        const idioma_definido = client.idioma.getLang(interaction)
        let url_pesquisa = `?idioma=${idioma_definido}`, nota_rodape = ' '

        // Entrada customizada, ativa caso o usuário tenha pesquisado por algo
        if (interaction.options.data.length > 0)
            url_pesquisa += `&item=${interaction.options.data[0].value}`

        fetch(`${process.env.url_apisal}/mine${url_pesquisa}`)
            .then(response => response.json())
            .then(async dados_item => {

                if (dados_item.status === 502)
                    return client.tls.reply(interaction, user, "util.minecraft.error_1", true, 0)

                if (dados_item.status === 404)
                    return interaction.reply({ content: `${client.emoji(emojis_negativos)} | ${client.tls.phrase(user, "util.minecraft.nao_encontrado")} \`${interaction.options.data[0].value}\`, ${client.tls.phrase(user, "util.minecraft.tente_novamente")}`, ephemeral: true })

                let nome_item = dados_item.internal_name
                descricao_tipo = nome_item

                let colet_suv = client.tls.phrase(user, "util.minecraft.sim")
                let empilhavel = `${client.tls.phrase(user, "util.minecraft.ate")} ${dados_item.stats.stackable}`
                let renovavel = client.tls.phrase(user, "util.minecraft.sim")

                let tipo_item = dados_item.stats.type

                if (dados_item.stats.type === "construcao")
                    tipo_item = client.tls.phrase(user, "util.minecraft.construcao")

                if (dados_item.type === "pocoes")
                    tipo_item = client.tls.phrase(user, "util.minecraft.pocoes")

                if (dados_item.stats.renewable === 0)
                    renovavel = client.tls.phrase(user, "util.minecraft.nao")

                if (dados_item.stats.stackable === 0)
                    empilhavel = client.tls.phrase(user, "util.minecraft.nao")

                if (dados_item.stats.collectable === 0)
                    colet_suv = client.tls.phrase(user, "util.minecraft.nao")

                let fields = { name: "⠀", value: "⠀" }
                let valores_item = ''

                if (idioma_definido !== "pt-br" && idioma_definido !== "al-br" && dados_item.description) {
                    const traduz_descri = dados_item.description.split("\n")

                    for (let k = 0; k < traduz_descri.length; k++) {

                        if (!descricao_tipo.includes("nether_star")) {
                            alvo = traduz_descri[k].split(":")[0]
                            alvo_json = alvo.replaceAll(" ", "_").normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase()
                        } else { // Traduzindo efeitos de poções e flechas
                            alvo = traduz_descri[k].split(" (")[0]
                            alvo_json = alvo.split(" ")[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase()

                            if (alvo_json.includes(":"))
                                alvo_json = alvo_json.split(":")[0]

                            nome_item += ` of ${client.tls.phrase(user, `util.minecraft.detalhes.${alvo_json}`)}`
                        }

                        traducao_alvo = client.tls.phrase(user, `util.minecraft.detalhes.${alvo_json}`)
                        valores_item = valores_item.replaceAll(alvo, traducao_alvo)
                    }

                    fields = { name: descricao_tipo, value: `\`${valores_item}\``, inline: true }
                }

                if ((parseFloat((dados_item.stats.version)) - 1) * 100 > 19)
                    nota_rodape = client.tls.phrase(user, "util.minecraft.nota_rodape")

                if (nota_rodape.includes("item_repl"))
                    nota_rodape = nota_rodape.replace("item_repl", pesquisa)

                const embed = new EmbedBuilder()
                    .setTitle(dados_item.name)
                    .setColor(client.embed_color(user.misc.color))
                    .setImage(dados_item.icon)
                    .addFields(
                        {
                            name: `${client.emoji(emojis.mc_coracao)}** ${client.tls.phrase(user, "util.minecraft.coletavel")}**`,
                            value: `\`${colet_suv}\``,
                            inline: true
                        },
                        {
                            name: `${client.emoji(emojis.mc_bamboo_sign)} **${client.tls.phrase(user, "util.minecraft.tipo")}**`,
                            value: `\`${tipo_item}\``,
                            inline: true
                        },
                        {
                            name: `${client.emoji(emojis.mc_goat_copper_horn)} **${client.tls.phrase(user, "util.minecraft.versao_add")}**`,
                            value: `\`${dados_item.stats.version}\``,
                            inline: true
                        }
                    )
                    .addFields(
                        {
                            name: `${client.emoji(emojis.mc_chest)} **${client.tls.phrase(user, "util.minecraft.empilhavel")}**`,
                            value: `\`${empilhavel}\``,
                            inline: true
                        },
                        {
                            name: `${client.emoji(emojis.mc_cornflower)} **${client.tls.phrase(user, "util.minecraft.renovavel")}**`,
                            value: `\`${renovavel}\``,
                            inline: true
                        },
                        {
                            name: `${client.emoji(emojis.mc_name_tag)} **${client.tls.phrase(user, "util.minecraft.nome_interno")}**`,
                            value: `**\`minecraft:${dados_item.internal_name}\`**`,
                            inline: true
                        }, fields
                    )
                    .setFooter({ text: nota_rodape })

                if (dados_item.durability)
                    embed.addFields(
                        {
                            name: "⠀",
                            value: "⠀",
                            inline: true
                        },
                        {
                            name: `${client.emoji(emojis.mc_anvil)} **Durabilidade: ${dados_item.durability + 1}**`,
                            value: "⠀",
                            inline: true
                        }
                    )

                if (dados_item.wiki !== "") {

                    let nome_wiki = idioma_definido === "pt-br" ? dados_item.name : dados_item.internal_name

                    let link_artigo = `https://minecraft.fandom.com/pt/wiki/${nome_wiki.replaceAll(" ", "_")}`

                    link_artigo = `${client.tls.phrase(user, "util.minecraft.mais_detalhes_wiki").replace("link_repl", link_artigo)}`

                    embed.addFields(
                        {
                            name: `${client.emoji(emojis.mc_logo_wikipedia)} Wiki sobre ${dados_item.name}`,
                            value: `\`\`\`fix\n${formata_texto(dados_item.wiki)}\`\`\`\n${link_artigo}`,
                            inline: false
                        }
                    )
                }

                interaction.reply({ embeds: [embed], ephemeral: user?.conf.ghost_mode || false })
            })
    }
}