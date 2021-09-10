module.exports = {
    name: "menu_adm",
    description: "Informações secundárias do alonsal",
    aliases: [ "hm", "menuadm", "dm", "moderador", "mod" ],
    cooldown: 20,
    permissions: [ "ADMINISTRATOR" ],
    execute(client, message, args) {

        const reload = require('auto-reload');
        const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
        const idioma_adotado = idioma_servers[message.guild.id];
        
        const { MessageEmbed } = require('discord.js');

        const { emojis_negativos, emojis_dancantes } = require('../../arquivos/json/text/emojis.json');

        let emoji_nao_encontrado = client.emojis.cache.get(emojis_negativos[Math.round((emojis_negativos.length - 1) * Math.random())]).toString();
        let emoji_dancando = client.emojis.cache.get(emojis_dancantes[Math.round((emojis_dancantes.length - 1) * Math.random())]).toString();
        
        if(idioma_adotado == "pt-br"){
            embed = new MessageEmbed()
            .setTitle("Seus comandos Moderativos :scroll:")
            .setColor(0x29BB8E)
            .setDescription(emoji_dancando +' **`.addemoji `'+ emoji_dancando +'` dancando`** - Adiciona um emoji ao servidor\n'+ emoji_nao_encontrado +' **`.armoji `'+ emoji_nao_encontrado +'` `** - Remove um emoji do servidor\n:wastebasket: **`.acl 10`** - Remove várias mensagens de uma vez\n\n :hotsprings: | _Mensagens com este símbolo serão excluídas automaticamente._\n:octagonal_sign: | _Estes comandos não são habilitados para usuários sem cargos administrativos._')
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));
        }else{
            embed = new MessageEmbed()
            .setTitle("Your Moderative Commands :scroll:")
            .setColor(0x29BB8E)
            .setDescription(emoji_dancando +' **`.addemoji `'+ emoji_dancando +'` dancing`** - Add an emoji to the server\n'+ emoji_nao_encontrado +' **`.armoji `'+ emoji_nao_encontrado +'` `** - Remove an emoji from the server\n:wastebasket: **`.acl 10`** - Remove multiple messages at once\n\n :hotsprings: | _Messages with this symbol will be automatically deleted.._\n:octagonal_sign: | _These commands are not enabled for users without administrative roles._')
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));
        }

        client.users.cache.get(message.author.id).send(embed);

        const permissions = message.channel.permissionsFor(message.client.user);

        if(permissions.has("MANAGE_MESSAGES")) // Permissão para gerenciar mensagens
            message.delete();
    }
};