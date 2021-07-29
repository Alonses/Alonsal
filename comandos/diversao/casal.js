module.exports = {
    name: "casal",
    description: "Teste o nível de afeto entre duas pessoas",
    aliases: [ "mor" ],
    usage: "mor <@><@>",
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const { MessageEmbed } = require ('discord.js');

        if(args[1] === "" && args[2].includes("<@"))
            args.splice(1, 1);

        if(args.length != 2 || !args[0].includes("<@") || !args[1].includes("<@")){
            message.channel.send(`${message.author} marque duas pessoas para testar\nPor exemplo, \`.amor @Alonsal @Slondo\``);
            return;
        }
        
        let titulo = "Limda :gift_heart:";
        let num = 100;
        let porcentagem = "";
        let aviso = "Amor a si próprio é oq importa :heartpulse:";

        if(args[0] !== args[1]){
            num = Math.round(Math.random() * 100);
            aviso = "";
        }

        if(args[0] !== args[1]){
            if(num == 100)
                titulo = "Praticamente casados :heart_on_fire:";
            else if(num > 90)
                titulo = "Meu casal :smiling_face_with_3_hearts:";
            else if(num > 80)
                titulo = "Literalmente amantes :revolving_hearts:";
            else if(num > 60)
                titulo = "Tá rolando um clima :hot_face:";
            else if(num > 40)
                titulo = "Será? :eyes:";
            else if(num > 20)
                titulo = "Friendzone :people_hugging:";
            else
                titulo = "São inimigos públicos :angry:";
        }

        if(args[0] === args[1])
            porcentagem = ":sparkling_heart: ";
        else
            porcentagem = args[0] +" e "+ args[1] + "\n\n";

        for(let i = 0; i <= num - 10; i = i + 10){
            porcentagem += ":sparkling_heart: ";
        }

        for(let i = num; i < 100; i = i + 10){
            porcentagem += ":black_heart: ";
        }

        const embed = new MessageEmbed()
        .setColor(0x29BB8E)
        .setTitle(titulo)
        .setDescription(`O teste retornou ${num}%!\n${porcentagem}\n\n${aviso}`)
        .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }))
        .setTimestamp();

        message.channel.send(`${message.author}`, embed);
    }
};