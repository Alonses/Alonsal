const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "choose",
    description: "Informe vários itens, o alonsal escolherá um",
    aliases: [ "ch", "escolha", "decida", "selecione" ],
    cooldown: 3,
    execute(client, message, args) {
        
        const { jogos } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

        let escolhas = "";
        let nota_rodape = "";

        if (args.length < 1) return message.reply(jogos[4]["aviso_2"]);

        if (!args[0].raw.includes("[")){
            if(args.length < 2) return message.reply(jogos[4]["aviso_1"]);
        
            escolhas = `\`${args[Math.round((args.length - 1) * Math.random())]}\``;
        }else{

            if (args.length - 1 < 2) return message.reply(jogos[4]["aviso_1"]);

            const opcoes = args;
            const qtd_pers = args[0].raw.replace("[", "");

            if (qtd_pers === 0 || isNaN(qtd_pers)) return message.reply(`:octagonal_sign: | ${jogos[4]["aviso_2"]}`);

            opcoes.shift(); // Remove o indicador de qtd de escolhas

            if (qtd_pers === opcoes.length)
                nota_rodape = jogos[4]["escolho_todos"];

            for(let i = 0; i < qtd_pers; i++){

                if(i + 1 >= qtd_pers)
                    escolhas += " & ";

                const item = opcoes[Math.round((opcoes.length - 1) * Math.random())];
                escolhas += `\`${item}\``;

                if(i + 2 < qtd_pers)
                    escolhas += ", ";

                opcoes.splice(opcoes.indexOf(item), 1);
            }
        }

        const resultados = new MessageEmbed()
        .setTitle(`:ballot_box: ${jogos[4]["escolho"]}`)
        .setColor(0x29BB8E)
        .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
        .setDescription(escolhas)
        .setFooter(nota_rodape);

        message.reply({ embeds: [resultados]});
    }
}