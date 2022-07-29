const { MessageEmbed } = require('discord.js');
 
module.exports = {
    name: "password",
    description: "Gere senhas aleatórias",
    aliases: [ "psw" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const { utilitarios } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

        let tamanho = args.length > 0 ? parseInt(args[0].raw) : 12;
        tamanho = tamanho <= 5 ? 12 : tamanho;
        tamanho = tamanho >= 400 ? 350 : tamanho;

        let bonus = '';

        for(let i = 0; i < 3; i++){
            bonus += `${randomString(tamanho)}\n\n`;
        }

        const embed = new MessageEmbed()
        .setTitle(`:lock_with_ink_pen: ${utilitarios[18]["titulo"]}`)
        .setURL('https://password.kaspersky.com/')
        .setColor(0x29BB8E)
        .setDescription(`:passport_control: **${utilitarios[18]["primaria"]}**\n\`\`\`${randomString(tamanho)}\`\`\`\n :gift: **${utilitarios[18]["bonus"]}**\n\`\`\`${bonus}\`\`\``)
        .setFooter(utilitarios[18]["rodape"].replace("tamanho_repl", tamanho));

        const m = await message.reply(`:hotsprings: | ${utilitarios[18]["senha"]}`.replace("tamanho_repl", tamanho));
        await m.react('📫');

        client.users.cache.get(message.author.id).send({ embeds: [embed] });
        const permissions = message.channel.permissionsFor(message.client.user);

        setTimeout(() => { m.delete() }, 10000);

        if(permissions.has("MANAGE_MESSAGES")) // Permissão para gerenciar mensagens
            message.delete()
    }
}

function randomString(len) {
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdeeͪfghijklmnopqrstuvwxyz0123456789!@#$%¨&*()^[]{}+=~.,;:¢¬_-£"|\\/?§';
    let randomString = '';

    for (let i = 0; i < len; i++) {
        let randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.slice(randomPoz, randomPoz + 1);
    }

    // Aleatorizando mais uma vez o resultado final
    return shuffle(randomString.split(''))
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o.join("");
}