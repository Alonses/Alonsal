const { emojis, emojis_negativos } = require('../../arquivos/json/text/emojis.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: "mine",
    description: "Pesquise por itens e blocos do jogo pixelado",
    aliases: [ "mine", "craft", "mc", "mcs" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {
        const idioma_selecionado = client.idioma.getLang(message.guild.id);
        const { utilitarios } = require(`../../arquivos/idiomas/${idioma_selecionado}.json`);

        let nota_rodape = "";
        const emoji_suv = client.emojis.cache.get(emojis.mc_coracao).toString();

        let pesquisa = args.join(" ");
        const nome_interno = pesquisa.split(" ").join("_").toLocaleLowerCase(); // Pesquisa usando nome em inglês/interno
        pesquisa = pesquisa.charAt(0).toUpperCase() + pesquisa.slice(1);

        const random = pesquisa === "";

        fetch('https://raw.githubusercontent.com/brnd-21/inventario-mine/main/JSON/dados_locais.json')
        .then(response => response.json())
        .then(async lista_itens => {
            let descr_pesquisa;
            let url;
            let alvo_json;
            let alvo;
            for (let i = 0; i < lista_itens.length; i++) {

                let descri = false;

                const nome_simplificado = lista_itens[i].nome_item.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();

                let auto_compl = nome_simplificado;
                auto_compl = auto_compl.toLocaleLowerCase();

                if (lista_itens[i].descricao !== null) {
                    descr_pesquisa = lista_itens[i].descricao.toLocaleLowerCase();

                    if (descr_pesquisa.includes(pesquisa.toLocaleLowerCase()))
                        descri = true;
                }

                if ((pesquisa === nome_simplificado || pesquisa === lista_itens[i].nome_interno) || random || nome_interno === lista_itens[i].nome_interno || descri || auto_compl.includes(pesquisa.toLocaleLowerCase())) {

                    if (random)
                        i = Math.round((lista_itens.length - 1) * Math.random());

                    url = `https://raw.githubusercontent.com/brnd-21/inventario-mine/main/IMG/Itens/new/${lista_itens[i].tipo_item}/${lista_itens[i].nome_icon}`;

                    let nome_item = lista_itens[i].nome_item;
                    let colet_suv = utilitarios[9]["sim"];
                    let empilhavel = `${utilitarios[9]["ate"]} ${lista_itens[i].empilhavel}`;
                    let renovavel = utilitarios[9]["sim"];

                    let tipo_item = lista_itens[i].tipo_item;

                    if (lista_itens[i].tipo_item === "Construcao")
                        tipo_item = utilitarios[9]["construcao"];

                    if (lista_itens[i].tipo_item === "Pocoes")
                        tipo_item = utilitarios[9]["pocoes"];

                    if (lista_itens[i].renovavel === 0)
                        renovavel = utilitarios[9]["nao"];

                    if (lista_itens[i].empilhavel === 0)
                        empilhavel = utilitarios[9]["nao"];

                    if (lista_itens[i].coletavel === 0)
                        colet_suv = utilitarios[9]["nao"];

                    const fields = [];

                    if (lista_itens[i].descricao != null) {
                        if (lista_itens[i].descricao.includes("[&")) { // Poções

                            let valores_item = lista_itens[i].descricao;

                            let descricao_tipo = `:magic_wand: ${utilitarios[9]["efeitos_aplicados"]}`;

                            if (!nome_item.includes("Poção") && !nome_item.includes("Frasco") && !nome_item.includes("Flecha"))
                                descricao_tipo = `:receipt: ${utilitarios[9]["atributos"]}`;

                            if (nome_item === "Disco musical") {
                                nome_item = utilitarios[9]["disco_musical"];

                                valores_item = valores_item.replace("[&r", "");
                                nome_item += ` | ${valores_item}`;

                            }

                            if (nome_item === "Livro encantado") {
                                nome_item = utilitarios[9]["livro_encantado"];

                                valores_item = valores_item.replace("[&r", "");
                                nome_item += ` | ${valores_item}`;
                            } else {

                                valores_item = valores_item.replace("[&s[&3Efeito aplicado: ", "");
                                valores_item = valores_item.replaceAll(") ", ")");
                                valores_item = valores_item.replace("[&s[&r", "\n");
                                valores_item = valores_item.replace("&s[&r", "\n");
                                valores_item = valores_item.replaceAll("[&1", "\n");
                                valores_item = valores_item.replaceAll("[&2", "\n");
                                valores_item = valores_item.replaceAll("&2", "\n");
                                valores_item = valores_item.replaceAll("[&4", "\n");
                                valores_item = valores_item.replaceAll("[&3", "\n");
                                valores_item = valores_item.replaceAll("&r", "");
                                valores_item = valores_item.substr(1);

                                if (idioma_selecionado === "en-us" || nome_interno === lista_itens[i].nome_interno)
                                    nome_item = lista_itens[i].nome_interno.replaceAll("_", " ").replace(/^\w/, (c) => c.toUpperCase());

                                if (idioma_selecionado === "en-us") {
                                    const traduz_descri = valores_item.split("\n");

                                    for (let k = 0; k < traduz_descri.length; k++) {

                                        if (!descricao_tipo.includes(":magic_wand:")) {
                                            alvo = traduz_descri[k].split(":")[0];
                                            alvo_json = alvo.replaceAll(" ", "_").normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
                                        } else { // Traduzindo efeitos de poções e flechas
                                            alvo = traduz_descri[k].split(" (")[0];
                                            alvo_json = alvo.split(" ")[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();

                                            if (alvo_json.includes(":"))
                                                alvo_json = alvo_json.split(":")[0];

                                            nome_item += ` of ${utilitarios[9]["detalhes"][alvo_json]}`;
                                        }

                                        traducao_alvo = utilitarios[9]["detalhes"][alvo_json];
                                        valores_item = valores_item.replaceAll(alvo, traducao_alvo);
                                    }
                                }

                                fields.push({name: descricao_tipo, value: `\`${valores_item}\``});
                            }
                        }
                    }

                    if (lista_itens[i].versao_add > 17)
                        nota_rodape = utilitarios[9]["nota_rodape"];

                    const embed = new MessageEmbed()
                        .setTitle(nome_item)
                        .setColor(0x29BB8E)
                        .setImage(url)
                        .addFields(
                            {
                                name: `${emoji_suv}** ${utilitarios[9]["coletavel"]}**`,
                                value: `\`${colet_suv}\``,
                                inline: true
                            },
                            {name: `:label: **${utilitarios[9]["tipo"]}**`, value: `\`${tipo_item}\``, inline: true},
                            {
                                name: `:bookmark_tabs: **${utilitarios[9]["versao_add"]}**`,
                                value: `\`1.${lista_itens[i].versao_add}\``,
                                inline: true
                            },
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
                        .setFooter(nota_rodape);

                    return message.reply({embeds: [embed]});
                }
            }

            const emoji_nao_encontrado = client.emojis.cache.get(emojis_negativos[Math.round((emojis_negativos.length - 1) * Math.random())]).toString();

            message.reply(`${emoji_nao_encontrado} | ${utilitarios[9]["nao_encontrado"]} \`${pesquisa}\`, ${utilitarios[9]["tente_novamente"]}`);
        })
        .catch(() => {
            return message.reply(`:octagonal_sign: | ${utilitarios[9]["error_1"]}`);
        });
    }
};