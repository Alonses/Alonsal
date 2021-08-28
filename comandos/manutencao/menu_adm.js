module.exports = {
    name: "menu_adm",
    description: "Informações secundárias do alonsal",
    aliases: [ "hm", "menuadm", "dm", "moderador", "mod" ],
    cooldown: 3,
    permissions: [ "ADMINISTRATOR" ],
    execute(client, message, args) {

        message.delete();

        const { MessageEmbed } = require('discord.js');

        const { emojis_negativos, emojis_dancantes } = require('../../arquivos/json/text/emojis.json');

        let emoji_nao_encontrado = client.emojis.cache.get(emojis_negativos[Math.round((emojis_negativos.length - 1) * Math.random())]).toString();
        let emoji_dancando = client.emojis.cache.get(emojis_dancantes[Math.round((emojis_negativos.length - 1) * Math.random())]).toString();
        
        const embed = new MessageEmbed()
        .setTitle('Seus comandos Moderativos :scroll:')
        .setColor(0x29BB8E)
        .setDescription(emoji_dancando +' **`.addemoji `'+ emoji_dancando +'` dancando`** - Adiciona um emoji ao servidor\n'+ emoji_nao_encontrado +' **`.armoji `'+ emoji_nao_encontrado +'` `** - Remove um emoji do servidor\n:wastebasket: **`.acl 10`** - Remove várias mensagens de uma vez\n\n :hotsprings: | _Mensagens com este símbolo serão excluídas automaticamente._\n:octagonal_sign: | _Estes comandos não são habilitados para usuários sem cargos administrativos._')
        .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));
        
        client.users.cache.get(message.author.id).send(embed);
    }
};