const { MessageEmbed } = require('discord.js');
const { emojis_negativos, emojis_dancantes } = require('../../arquivos/json/text/emojis.json');

module.exports = {
    name: "menu_adm",
    description: "Informações de moderação do alonsal",
    aliases: [ "hm", "menuadm", "dm", "moderador", "mod" ],
    cooldown: 20,
    permissions: [ "ADMINISTRATOR" ],
    execute(client, message, args) {

        const idioma_adotado = client.idioma.getLang(message.guild.id);

        let emoji_nao_encontrado = client.emojis.cache.get(emojis_negativos[Math.round((emojis_negativos.length - 1) * Math.random())]).toString();
        let emoji_dancando = client.emojis.cache.get(emojis_dancantes[Math.round((emojis_dancantes.length - 1) * Math.random())]).toString();
        
        let prefix = client.prefixManager.getPrefix(message.guild.id);
        let embed;

        if(idioma_adotado === "pt-br"){   
            embed = new MessageEmbed()
            .setTitle("Seus comandos Moderativos :scroll:")
            .setColor(0x29BB8E)
            .setDescription(`${emoji_dancando} **\`${prefix}ddemoji emoji_dancando \`${emoji_dancando}\` \`** - Adiciona um emoji ao servidor\n${emoji_nao_encontrado} **\`${prefix}rmoji \`${emoji_nao_encontrado}\` \`** - Remove um emoji do servidor\n:wastebasket: **\`${prefix}cl 10\`** - Remove várias mensagens de uma vez\n:axe: **\`${prefix}ban @Slondo\`** | **\`${prefix}ban @Slondo 500\`** - Bane um usuário eternamente ou com tempo\n:leg: **\`${prefix}kick @Slondo\`** - Expulsa um usuário\n:symbols: **\`${prefix}px <novoprefixo>\`** - Altera o prefixo do Alonsal\n:video_game: **\`${prefix}angm <@cargo>\`** - Anúncios de jogos Gratuitos\n\n :hotsprings: | _Mensagens com este símbolo serão excluídas automaticamente._\n:octagonal_sign: | _Estes comandos não são habilitados para usuários sem cargos administrativos._\n:flag_us: | _Use the command \`${prefix}lang en\` to switch to \`american english\`_`)
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));
        }else{
            embed = new MessageEmbed()
            .setTitle("Your Moderative Commands :scroll:")
            .setColor(0x29BB8E)
            .setDescription(`${emoji_dancando} **\`${prefix}ddemoji dancing \`${emoji_dancando}\` \`** - Add an emoji to the server\n${emoji_nao_encontrado} **\`${prefix}rmoji ${emoji_nao_encontrado}\` \`** - Remove an emoji from the server\n:wastebasket: **\`${prefix}cl 10\`** - Remove multiple messages at once\n:axe: **\`${prefix}ban @Slondo\`** | **\`${prefix}ban @Slondo 500\`** - Ban a user forever or over time\n:leg: **\`${prefix}kick @Slondo\`** - Kicks out a user\n:symbols: **\`${prefix}px <newprefix>\`** - Change Alonsal prefix\n:video_game: **\`${prefix}angm <@tag>\`** - Free game notifications\n\n :hotsprings: | _Messages with this symbol will be automatically deleted._\n:octagonal_sign: | _These commands are not enabled for users without administrative roles._\n:flag_br: | _Use o comando \`${prefix}lang pt\` para trocar para o \`português brasileiro\`_`)
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));
        }

        client.users.cache.get(message.author.id).send({ embeds: [embed] });

        const permissions = message.channel.permissionsFor(message.client.user);
        if(permissions.has("MANAGE_MESSAGES")) // Permissão para gerenciar mensagens
            message.delete();
    }
};