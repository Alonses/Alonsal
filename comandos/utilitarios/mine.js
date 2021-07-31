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

        emoji_suv = client.emojis.cache.get(emojis.mc_coracao).toString();

        args.forEach(value => {
            pesquisa += value + " ";
        });
        
        let nome_interno = pesquisa.slice(0, -1).split(" ").join("_"); // Pesquisa usando nome em inglês/interno

        if(pesquisa.includes("ardosia"))
            pesquisa = pesquisa.replace("ardosia", "ardósia");

        pesquisa = pesquisa.charAt(0).toUpperCase() + pesquisa.slice(1);
        pesquisa = pesquisa.slice(0, -1);
        
        let random = false;

        if(pesquisa == "") // random
            random = true;

        for(var i = 0; i < lista_itens.length; i++){
            if((pesquisa == lista_itens[i].nome_item || pesquisa == lista_itens[i].nome_interno) || random || nome_interno == lista_itens[i].nome_interno){
                
                if(random)
                    i = Math.round((lista_itens.length - 1) * Math.random());

                url = "https://raw.githubusercontent.com/brnd-21/inventario-mine/main/IMG/Itens/"+ lista_itens[i].tipo_item + "/" + lista_itens[i].nome_img;
                
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

                const embed = new MessageEmbed()
                .setTitle(lista_itens[i].nome_item)
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
                    { name: ':link: **Nome interno**', value: " **`minecraft:"+ lista_itens[i].nome_interno +"`** ", inline: true },
                );
                
                message.lineReply(embed);

                return;
            }
        }

        let emoji_nao_encontrado = client.emojis.cache.get(emojis_negativos[Math.round((emojis_negativos.length - 1) * Math.random())]).toString();

        message.lineReply(emoji_nao_encontrado +" | Não encontrei nenhum item ou bloco com o nome `"+ pesquisa +"`, tente novamente");
    }
};