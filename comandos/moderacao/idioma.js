const { MessageEmbed } = require("discord.js");

const idiomasMap = {
    "pt": [ "pt-br", ":flag_br: | Idioma alterado para `Português Brasileiro`" ],
    "al": [ "al-br", ":pirate_flag: | Meu idioma agora é o `Alonsês`" ],
    "en": [ "en-us", ":flag_us: | Language switched to `American English`" ],
    "fr": [ "fr-fr", ":flag_fr: | Langue changée en `Français`" ]
}

module.exports = {
    name: "idioma",
    description: "Altere o idioma do alonsal",
    aliases: [ "language", "lang" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message) {
        
        const { moderacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

        if (!message.member.permissions.has('MANAGE_GUILD') && !client.owners.includes(message.author.id))
            return message.reply(`:octagonal_sign: | ${moderacao[3]["permissao_1"]}`).then(msg => setTimeout(() => msg.delete(), 5000)); // Libera configuração para o Slondo e adms apenas

        const prefix = client.prefixManager.getPrefix(message.guild.id);
        const novo_idioma = message.content.split(" ")[1] || "";
        
        // Verifica se o idioma é válido
        const matches = novo_idioma.match(/pt|al|en|fr/);

        if(matches == null){ // Retorna a lista de idiomas válidos
            embed_idiomas = new MessageEmbed()
            .setTitle(moderacao[0]["titulo_idioma"])
            .setColor(0x29BB8E)
            .setDescription(":flag_br: `.alang pt` - Português\n:pirate_flag: `.alang al` - Alonsês\n:flag_us: `.alang en` - English\n:flag_fr: `.alang fr` - French".replaceAll(".a", prefix));
            
            return message.reply({embeds: [embed_idiomas]});
        }

        // Resgata os dados do idioma válido
        const sigla_idioma = idiomasMap[matches[0]][0];
        const frase_idioma = idiomasMap[matches[0]][1];
        const bandeira_idioma = frase_idioma.split(" ")[0];

        client.channels.cache.get('872865396200452127').send(`${bandeira_idioma} | Idioma do servidor ( \`${message.guild.name}\` | \`${message.guild.id}\` ) atualizado para \`${sigla_idioma}\``);

        client.idioma.setLang(message.guild.id, sigla_idioma);
        message.reply(frase_idioma);
    }
};