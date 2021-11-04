const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "anagrama",
    description: "Anagramas",
    aliases: [ "na", "anagram" ],
    usage: "na <any>",
    cooldown: 2,
    async execute(client, message, args){

        const { diversao } = require('../../arquivos/idiomas/'+ client.idioma.getLang(message.guild.id) +'.json');

        let string = args.join(" ");
        let cor_embed = 0x29BB8E;

        function duplicateCount(string) {
            const charMap = {};

            for (const char of string.toLowerCase()) {
                charMap[char] = (charMap[char] || 0) + 1;
            }

            return Object.values(charMap).filter((count) => count > 0);
        }

        const caracteres = duplicateCount(string);
        const fatori = string.split('');
        const fatori_fix = fatori;
        let mult = 1;
        let rept = 1;

        for(let i = 1; i < fatori.length + 1; i++){
            mult *= i;
        }

        for(let i = 0; i < caracteres.length; i++){
            fatorial = 1;

            if(caracteres[i] > 1){
                for(let x = 1; x <= caracteres[i]; x++){
                    fatorial *= x;
                }

                rept *= fatorial;
            }
        }

        result = mult;

        if(rept > 1)
            result /= rept;

        function shuffleArray(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            
            return arr;
        }

        let anagrama_formado = [];
        let exib_formatado = "";
        let qtd_quebras = [];

        for(let i = 0; i < 3; i++){
            anagrama_formado.push(await shuffleArray(fatori_fix).join(''));

            exib_formatado += "**-** `"+ anagrama_formado[i] +"`\n";
            qtd_quebras = exib_formatado.split(anagrama_formado[i]);

            if(qtd_quebras.length > 2 && fatori_fix.length > 4)
                cor_embed = 0xfbff3d;
        }

        if(cor_embed == 0xfbff3d)
            exib_formatado += "\n:four_leaf_clover: | _"+ diversao[5]["sorte"] +"_";

        const anagrama = new MessageEmbed()
        .setTitle(":abc: "+ diversao[5]["anagrama"])
        .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
        .setColor(cor_embed)
        .setDescription(diversao[5]["entrada"] +": `"+ string +"`\n"+ diversao[5]["combinacao"] +": \n"+ exib_formatado)
        .setFooter(diversao[5]["sequencia"] +" "+ result.toLocaleString('pt-BR') +" "+ diversao[5]["combinacoes"]);

        message.reply({embeds: [anagrama]});
    },
    slash_params: [{
        name: "anagrama",
        description: "Alguns anagramas",
        type: 3,
        required: true
    }],
    async slash(client, handler, data, params) {

        const lang = client.idioma.getLang(data.guild_id);
        const anagrama = params.get("anagrama");

        const { diversao } = require('../../arquivos/idiomas/'+ lang +'.json');
    
        if(typeof anagrama == "undefined")
            return handler.postSlashMessage(data, diversao[5]["aviso_1"]);

        let cor_embed = 0x29BB8E;

        function duplicateCount(string) {
            const charMap = {};

            for (const char of string.toLowerCase()) {
                charMap[char] = (charMap[char] || 0) + 1;
            }

            return Object.values(charMap).filter((count) => count > 0);
        }

        const caracteres = duplicateCount(anagrama);
        const fatori = anagrama.split('');
        const fatori_fix = fatori;
        let mult = 1;
        let rept = 1;

        for(let i = 1; i < fatori.length + 1; i++){
            mult *= i;
        }

        for(let i = 0; i < caracteres.length; i++){
            fatorial = 1;

            if(caracteres[i] > 1){
                for(let x = 1; x <= caracteres[i]; x++){
                    fatorial *= x;
                }

                rept *= fatorial;
            }
        }

        result = mult;

        if(rept > 1)
            result /= rept;

        function shuffleArray(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            
            return arr;
        }

        let anagrama_formado = [];
        let exib_formatado = "";
        let qtd_quebras = [];

        for(let i = 0; i < 3; i++){
            anagrama_formado.push(await shuffleArray(fatori_fix).join(''));

            exib_formatado += "**-** `"+ anagrama_formado[i] +"`\n";
            qtd_quebras = exib_formatado.split(anagrama_formado[i]);

            if(qtd_quebras.length > 2 && fatori_fix.length > 4)
                cor_embed = 0xfbff3d;
        }

        if(cor_embed == 0xfbff3d)
            exib_formatado += "\n:four_leaf_clover: | _"+ diversao[5]["sorte"] +"_";

        const anagramas_possiveis = `:abc: ${diversao[5]["anagrama"]}\n\n${diversao[5]["entrada"]}: \`${anagrama}\`\n ${diversao[5]["combinacao"]}: \n${exib_formatado}\n${diversao[5]["sequencia"]} ${result.toLocaleString('pt-BR')} ${diversao[5]["combinacoes"]}`;
        
        handler.postSlashMessage(data, anagramas_possiveis);
    }
}