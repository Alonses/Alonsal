module.exports = {
    name: "mine",
    description: "Pesquise por itens e blocos do jogo pixelado",
    aliases: [ "mine", "craft", "mc", "mcs" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {
        
        const { emojis, emojis_negativos } = require('../../arquivos/json/text/emojis.json');
        const { lista_itens } = require("../../arquivos/json/dados/itens_mine.json");
        const { MessageEmbed } = require('discord.js');
        let pesquisa = "";

        String.prototype.replaceAll = String.prototype.replaceAll || function(needle, replacement) {
            return this.split(needle).join(replacement);
        };

        emoji_suv = client.emojis.cache.get(emojis.mc_coracao).toString();

        args.forEach(value => {
            pesquisa += value +" ";
        });

        let nome_interno = pesquisa.slice(0, -1).split(" ").join("_").toLocaleLowerCase(); // Pesquisa usando nome em inglês/interno

        if(pesquisa.includes("ardosia"))
            pesquisa = pesquisa.replace("ardosia", "ardósia");

        pesquisa = pesquisa.charAt(0).toUpperCase() + pesquisa.slice(1);
        pesquisa = pesquisa.slice(0, -1);
        
        let random = false;

        if(pesquisa == "") // random
            random = true;

        for(var i = 0; i < lista_itens.length; i++){

            let descri = false;

            let auto_compl = lista_itens[i].nome_item;
            auto_compl = auto_compl.toLocaleLowerCase();

            if(lista_itens[i].descricao !== null){
                descr_pesquisa = lista_itens[i].descricao.toLocaleLowerCase();

                if(descr_pesquisa.includes(pesquisa.toLocaleLowerCase()))
                    descri = true;
            }

            if((pesquisa == lista_itens[i].nome_item || pesquisa == lista_itens[i].nome_interno) || random || nome_interno == lista_itens[i].nome_interno || descri || auto_compl.includes(pesquisa.toLocaleLowerCase())){
                
                if(random)
                    i = Math.round((lista_itens.length - 1) * Math.random());

                url = "https://raw.githubusercontent.com/brnd-21/inventario-mine/main/IMG/Itens/new/"+ lista_itens[i].tipo_item + "/" + lista_itens[i].nome_img;
    
                let nome_item = lista_itens[i].nome_item;
                let colet_suv = "Sim";
                let empilhavel = "Até "+ lista_itens[i].empilhavel;
                let renovavel = "Sim";

                let tipo_item = lista_itens[i].tipo_item;

                if(lista_itens[i].tipo_item == "Construcao")
                    tipo_item = "Construção";
                
                if(lista_itens[i].tipo_item == "Pocoes")
                    tipo_item = "Poções";
                
                if(lista_itens[i].renovavel == 0)
                    renovavel = "Não";

                if(lista_itens[i].empilhavel == 0)
                    empilhavel = "Não";

                if(lista_itens[i].coletavel == 0)
                    colet_suv = "Não";

                let fields = [];

                if(lista_itens[i].descricao != null){
                    if(lista_itens[i].descricao.includes("[&")){ // Poções

                        let valores_item = lista_itens[i].descricao;
                        
                        let descricao_tipo = ":magic_wand: Efeitos Aplicados";

                        if(!nome_item.includes("Poção") && !nome_item.includes("Frasco") && !nome_item.includes("Flecha"))
                            descricao_tipo = ":receipt: Atributos";
                        
                        if(nome_item == "Disco musical"){
                            valores_item = valores_item.replace("[&r", "");
                            nome_item += " | "+ valores_item;

                        }else if(nome_item == "Livro encantado"){
                            valores_item = valores_item.replace("[&r", "");
                            nome_item += " | "+ valores_item;
                        }else{

                            valores_item = valores_item.replace("[&s[&3Efeito aplicado: ", "");
                            valores_item = valores_item.replaceAll(") ", ")");
                            valores_item = valores_item.replace("[&s[&r", "\n");
                            valores_item = valores_item.replace("&s[&r", "\n");
                            valores_item = valores_item.replaceAll("[&1", "\n");
                            valores_item = valores_item.replaceAll("[&2", "\n");
                            valores_item = valores_item.replaceAll("&2", "\n");
                            valores_item = valores_item.replaceAll("[&4", "\n");
                            valores_item = valores_item.replaceAll("[&3", "\n");

                            valores_item = valores_item.substr(1);

                            fields.push({ name: descricao_tipo, value: "`"+ valores_item +"`"});
                        }
                    }
                }

                const embed = new MessageEmbed()
                .setTitle(nome_item)
                .setColor(0x29BB8E)
                .setImage(url)
                .addFields(
                    { name: emoji_suv +' **Coletável**', value: "`"+ colet_suv +"`", inline: true },
                    { name: ':label: **Tipo**', value: "`"+ tipo_item +"`", inline: true },
                    { name: ':bookmark_tabs: **Versão adicionada**', value: "`"+ lista_itens[i].versao_add +"`", inline: true },
                )
                .addFields(
                    { name: ':abacus: **Empilhável**', value: "`"+ empilhavel +"`", inline: true },
                    { name: ':herb: **Renovável**', value: "`"+ renovavel +"`", inline: true },
                    { name: ':link: **Nome interno**', value: " **`minecraft:"+ lista_itens[i].nome_interno +"`** ", inline: true }, fields
                );
                
                message.lineReply(embed);

                return;
            }
        }

        let emoji_nao_encontrado = client.emojis.cache.get(emojis_negativos[Math.round((emojis_negativos.length - 1) * Math.random())]).toString();

        message.lineReply(emoji_nao_encontrado +" | Não encontrei nenhum item ou bloco com o nome `"+ pesquisa +"`, tente novamente");
    }
};