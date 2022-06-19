const fs = require('fs');

module.exports = {
    name: "rankvalue",
    description: "Mude o valor do ranking",
    aliases: [ "crkv" ],
    cooldown: 3,
    usage: "rkv <number>",
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
    
        if (!client.owners.includes(message.author.id)) return;
        
        let valor_ranking = parseInt(args[0].raw) == 0 ? 2 : parseInt(args[0].raw);

        fs.readFile('./arquivos/data/ranking/ranking.txt', 'utf8', function(err, data) {
            if (err) throw err;
            
            fs.writeFile('./arquivos/data/ranking/ranking.txt', valor_ranking.toString(), (err) => {
                if (err) throw err;
            });
        });

        message.reply(`:tropical_drink: | Agora o ranking está dando \`${valor_ranking}x\` experiência`);
        client.channels.cache.get('872865396200452127').send(`:medal: | Ranking do Alonsal ajustado para \`${valor_ranking}x\``);
    }
};