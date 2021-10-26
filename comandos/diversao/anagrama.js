const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "anagrama",
    description: "Anagramas",
    aliases: [ "na", "anagram" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args){

        if(args.length < 1)
            return message.reply("Informe algo além do comando, por exemplo `.ana alonsal > odnols`");

        let string = "";

        args.forEach(value => {
            string += value +" ";
        });
    
        string = string.slice(0, -1);

        // if(string.includes("nk "))
        //     string = string.replace("nk ", "");

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
            result = mult / rept;

        function shuffleArray(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            
            return arr;
        }

        let anagrama_formado = await shuffleArray(fatori_fix);
        anagrama_formado = anagrama_formado.join('');

        const anagrama = new MessageEmbed()
        .setTitle(":abc: Seu anagrama")
        .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
        .setColor(0x29BB8E)
        .setDescription("Entrada original: `"+ string +"`\nCombinação possível: `" + anagrama_formado + "`")
        .setFooter("Sua sequência de caracteres produz outras "+ result.toLocaleString('pt-BR') +" combinações!");

        message.reply({embeds: [anagrama]});

        // if(args[0] === "nk"){
        //     const permissions_bot = await message.guild.members.fetch(message.client.user.id);

        //     if(!permissions_bot.permissions.has("MANAGE_NICKNAMES"))
        //         return message.reply(":interrobang: | O anagrama foi criado, mas eu não posso alterar seu apelido pois não tenho a permissão `Gerenciar apelidos` :(");

        //     if(message.author.id === message.guild.ownerId)
        //         return message.reply("Eu não posso alterar o seu apelido automaticamente :(");

        //     message.member.setNickname(anagrama_formado);
        //     message.reply("Seu apelido neste servidor foi alterado");
        // }
    }
}