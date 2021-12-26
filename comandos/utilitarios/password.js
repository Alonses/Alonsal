const { MessageEmbed } = require('discord.js');
 
module.exports = {
    name: "password",
    description: "Gere senhas aleatórias",
    aliases: [ "psw" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        let tamanho = args.length > 0 ? parseInt(args[0].raw) : 12;
        tamanho = tamanho <= 5 ? 12 : tamanho;
        let bonus = '';

        for(let i = 0; i < 3; i++){
            bonus += `${randomString(tamanho)}\n\n`;
        }

        const embed = new MessageEmbed()
        .setTitle('Su4s §3nH@5, clique aqui para testar sua senha')
        .setURL('https://password.kaspersky.com/')
        .setColor(0x29BB8E)
        .setDescription(`:passport_control: **Senha primária**\n\`\`\`${randomString(tamanho)}\`\`\`\n :gift: **Senhas bônus**\n\`\`\`${bonus}\`\`\``)
        .setFooter('4 senhas para escolher, elas não são salvas por aqui e nem sabemos o conteúdo, apenas você ;)');

        const m = await message.reply(`:hotsprings: | Verifique seu privado, sua senha foi gerada com um tamanho de \`tamanho_repl\` caracteres`.replace("tamanho_repl", tamanho));
        await m.react('📫');

        client.users.cache.get(message.author.id).send({ embeds: [embed] });
        const permissions = message.channel.permissionsFor(message.client.user);

        setTimeout(() => { m.delete() }, 10000);

        if(permissions.has("MANAGE_MESSAGES")) // Permissão para gerenciar mensagens
            message.delete()
    }
}

function randomString(len) {
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%¨&*()`^´[]{}+=~^.,;:¢¬_-£³²¹\'"|\\/?°§ªº';
    let randomString = '';

    for (let i = 0; i < len; i++) {
        let randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }

    return randomString;
}