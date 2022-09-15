const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const busca_emoji = require('../../adm/funcoes/busca_emoji')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { emojis, emojis_negativos } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mine')
        .setDescription('⌠💡⌡ Search Minecraft items')
        .setDescriptionLocalizations({
            "pt-BR": '⌠💡⌡ Pesquise itens do Minecraft',
            "fr": '⌠💡⌡ Rechercher des articles Minecraft'
        })
        .addStringOption(option =>
            option.setName('item')
                .setDescription('Insert an item')
                .setDescriptionLocalizations({
                    "pt-BR": 'Insira um item',
                    "fr": 'Insérer un élément'
                })),
    async execute(client, interaction) {

        const idioma_definido = client.idioma.getLang(interaction)
        const { utilitarios } = require(`../../arquivos/idiomas/${idioma_definido}.json`)

        let objeto_encontrado = false, i = 0, pesquisa_crua = ""
        const emoji_suv = busca_emoji(client, emojis.mc_coracao)
        const logo_wikipedia = busca_emoji(client, emojis.mc_logo_wikipedia)

        // Entrada customizada, ativa caso o usuário tenha escrevido algo ao rodar o comando
        if (interaction.options.data.length > 0) pesquisa_crua = interaction.options.data[0].value

        const nome_interno = pesquisa_crua.split(" ").join("_").toLocaleLowerCase() // Pesquisa usando nome em inglês/interno
        pesquisa_crua = pesquisa_crua.charAt(0).toUpperCase() + pesquisa_crua.slice(1)

        const random = pesquisa_crua === ""

        fetch('https://raw.githubusercontent.com/odnols/inventario-mine/main/Files/JSON/dados_locais.json')
            .then(response => response.json())
            .then(async lista_itens => {
                let descr_pesquisa, url, alvo, alvo_json, pesquisa

                while (i < lista_itens.length && !objeto_encontrado) {

                    let descri = false, nota_rodape = "⠀"
                    const nome_simplificado = lista_itens[i].nome_item.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase()

                    let auto_compl = nome_simplificado
                    auto_compl = auto_compl.toLocaleLowerCase()

                    if (lista_itens[i].descricao !== null) {
                        descr_pesquisa = lista_itens[i].descricao.toLocaleLowerCase()

                        if (descr_pesquisa.includes(pesquisa_crua.toLocaleLowerCase()))
                            descri = true
                    }

                    // Responsável pelo auto completa da pesquisa
                    let nome_simplificado_verif = false, nome_interno_verif = false, auto_compl_verif = false

                    if (!pesquisa_crua.includes("\"")) { // Verificando se não é uma pesquisa bruta
                        auto_compl_verif = auto_compl.includes(pesquisa_crua.toLocaleLowerCase())
                        nome_simplificado_verif = pesquisa_crua === nome_simplificado
                        nome_interno_verif = pesquisa_crua === lista_itens[i].nome_interno

                        pesquisa = pesquisa_crua
                    } else { // Pesquisa bruta
                        pesquisa = pesquisa_crua.replaceAll("\"", "")
                        auto_compl_verif = (pesquisa.length === nome_simplificado.length) && (pesquisa === nome_simplificado)
                    }

                    if (((nome_simplificado_verif || nome_interno_verif) || random || nome_interno === lista_itens[i].nome_interno || descri || auto_compl_verif) && !objeto_encontrado) {

                        if (random && !objeto_encontrado)
                            i = Math.round((lista_itens.length - 1) * Math.random())

                        url = `https://raw.githubusercontent.com/odnols/inventario-mine/main/IMG/Itens/new/${lista_itens[i].tipo_item}/${lista_itens[i].nome_icon}`

                        objeto_encontrado = true
                        let nome_item = lista_itens[i].nome_item
                        let nome_pesquisa_wiki = nome_item

                        let colet_suv = utilitarios[9]["sim"]
                        let empilhavel = `${utilitarios[9]["ate"]} ${lista_itens[i].empilhavel}`
                        let renovavel = utilitarios[9]["sim"]

                        let tipo_item = lista_itens[i].tipo_item

                        if (lista_itens[i].tipo_item === "Construcao")
                            tipo_item = utilitarios[9]["construcao"]

                        if (lista_itens[i].tipo_item === "Pocoes")
                            tipo_item = utilitarios[9]["pocoes"]

                        if (lista_itens[i].renovavel === 0)
                            renovavel = utilitarios[9]["nao"]

                        if (lista_itens[i].empilhavel === 0)
                            empilhavel = utilitarios[9]["nao"]

                        if (lista_itens[i].coletavel === 0)
                            colet_suv = utilitarios[9]["nao"]

                        let fields = { name: "⠀", value: "⠀" }

                        if (lista_itens[i].descricao != null) {
                            if (lista_itens[i].descricao.includes("[&")) { // Poções

                                let valores_item = lista_itens[i].descricao

                                let descricao_tipo = `:magic_wand: ${utilitarios[9]["efeitos_aplicados"]}`

                                if (!nome_item.includes("Poção") && !nome_item.includes("Frasco") && !nome_item.includes("Flecha"))
                                    descricao_tipo = `:receipt: ${utilitarios[9]["atributos"]}`

                                if (nome_item === "Disco musical") {
                                    nome_item = utilitarios[9]["disco_musical"]

                                    valores_item = valores_item.replace("[&r", "")
                                    nome_item += ` | ${valores_item}`
                                    nome_pesquisa_wiki = valores_item
                                }

                                if (nome_item === "Livro encantado") {
                                    nome_item = utilitarios[9]["livro_encantado"]

                                    valores_item = valores_item.replace("[&r", "")
                                    nome_item += ` | ${valores_item}`
                                    nome_pesquisa_wiki = valores_item
                                } else {

                                    valores_item = valores_item.replace("[&s[&3Efeito aplicado: ", "")
                                    valores_item = valores_item.replaceAll(") ", ")")
                                    valores_item = valores_item.replace("[&s[&r", "\n")
                                    valores_item = valores_item.replace("&s[&r", "\n")
                                    valores_item = valores_item.replaceAll("[&1", "\n")
                                    valores_item = valores_item.replaceAll("[&2", "\n")
                                    valores_item = valores_item.replaceAll("&2", "\n")
                                    valores_item = valores_item.replaceAll("[&4", "\n")
                                    valores_item = valores_item.replaceAll("[&3", "\n")
                                    valores_item = valores_item.replaceAll("&r", "")
                                    valores_item = valores_item.substr(1)

                                    if (idioma_definido === "en-us" || nome_interno === lista_itens[i].nome_interno)
                                        nome_item = lista_itens[i].nome_interno.replaceAll("_", " ").replace(/^\w/, (c) => c.toUpperCase())

                                    if (idioma_definido === "en-us") {
                                        const traduz_descri = valores_item.split("\n")

                                        for (let k = 0; k < traduz_descri.length; k++) {

                                            if (!descricao_tipo.includes(":magic_wand:")) {
                                                alvo = traduz_descri[k].split(":")[0]
                                                alvo_json = alvo.replaceAll(" ", "_").normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase()
                                            } else { // Traduzindo efeitos de poções e flechas
                                                alvo = traduz_descri[k].split(" (")[0]
                                                alvo_json = alvo.split(" ")[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase()

                                                if (alvo_json.includes(":"))
                                                    alvo_json = alvo_json.split(":")[0]

                                                nome_item += ` of ${utilitarios[9]["detalhes"][alvo_json]}`
                                            }

                                            traducao_alvo = utilitarios[9]["detalhes"][alvo_json]
                                            valores_item = valores_item.replaceAll(alvo, traducao_alvo)
                                        }
                                    }

                                    fields = { name: descricao_tipo, value: `\`${valores_item}\`` }
                                }
                            }
                        }

                        if (lista_itens[i].versao_add > 19)
                            nota_rodape = utilitarios[9]["nota_rodape"]

                        if (nota_rodape.includes("item_repl"))
                            nota_rodape = nota_rodape.replace("item_repl", pesquisa)

                        if (objeto_encontrado) {
                            // Procurando na wiki sobre a pesquisa
                            fetch(`https://minecraft.fandom.com/pt/wiki/${nome_pesquisa_wiki}`)
                                .then(response => response.text())
                                .then(async res => {

                                    let descricao_item_wiki

                                    try { // Verifica se o item possui uma breve descrição
                                        descricao_item_wiki = res.split(`<meta name="description" content="`)[1]
                                        descricao_item_wiki = descricao_item_wiki.split(`"/>`)[0]
                                    } catch (err) {
                                        descricao_item_wiki = ""
                                    }

                                    const embed = new EmbedBuilder()
                                        .setTitle(nome_item)
                                        .setColor(0x29BB8E)
                                        .setImage(url)
                                        .addFields(
                                            {
                                                name: `${emoji_suv}** ${utilitarios[9]["coletavel"]}**`,
                                                value: `\`${colet_suv}\``,
                                                inline: true
                                            },
                                            { name: `:label: **${utilitarios[9]["tipo"]}**`, value: `\`${tipo_item}\``, inline: true },
                                            {
                                                name: `:bookmark_tabs: **${utilitarios[9]["versao_add"]}**`,
                                                value: `\`1.${lista_itens[i].versao_add}\``,
                                                inline: true
                                            }
                                        )
                                        .addFields(
                                            {
                                                name: `:abacus: **${utilitarios[9]["empilhavel"]}**`,
                                                value: `\`${empilhavel}\``,
                                                inline: true
                                            },
                                            {
                                                name: `:herb: **${utilitarios[9]["renovavel"]}**`,
                                                value: `\`${renovavel}\``,
                                                inline: true
                                            },
                                            {
                                                name: `:link: **${utilitarios[9]["nome_interno"]}**`,
                                                value: `**\`minecraft:${lista_itens[i].nome_interno}\`**`,
                                                inline: true
                                            }, fields
                                        )
                                        .setFooter({ text: nota_rodape })

                                    if (descricao_item_wiki !== "") {

                                        let link_artigo = `https://minecraft.fandom.com/pt/wiki/${nome_pesquisa_wiki.replaceAll(" ", "_")}`

                                        link_artigo = `${utilitarios[9]["mais_detalhes_wiki"].replace("link_repl", link_artigo)}`

                                        embed.addFields(
                                            {
                                                name: `${logo_wikipedia} Wiki sobre ${nome_item}`,
                                                value: `\`\`\`fix\n${descricao_item_wiki}\`\`\`\n${link_artigo}`,
                                                inline: false
                                            }
                                        )
                                    }

                                    return interaction.reply({ embeds: [embed] })
                                })
                        }
                    } else
                        i++
                }

                if (!objeto_encontrado) {
                    const emoji_nao_encontrado = busca_emoji(client, emojis_negativos)

                    return interaction.reply(`${emoji_nao_encontrado} | ${utilitarios[9]["nao_encontrado"]} \`${pesquisa}\`, ${utilitarios[9]["tente_novamente"]}`)
                }
            })
            .catch(() => {
                return interaction.reply(`:octagonal_sign: | ${utilitarios[9]["error_1"]}`)
            })
    }
}