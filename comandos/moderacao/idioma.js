const { MessageEmbed } = require("discord.js");

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
        const novo_idioma = message.content.split(" ")[1];

        let idioma_selecionado = "pt-br";
        let idioma_alterado = ":flag_br: | Idioma alterado para `Português Brasileiro`";

        if(novo_idioma !== "pt" && novo_idioma !== "en" && novo_idioma !== "fr"){
            embed_idiomas = new MessageEmbed()
            .setTitle(moderacao[0]["titulo_idioma"])
            .setColor(0x29BB8E)
            .setDescription(":flag_br: `.alang pt` - Português\n:flag_us: `.alang en` - English\n:flag_fr: `.alang fr` - French".replaceAll(".a", prefix));
            
            return message.reply({embeds: [embed_idiomas]});
        }

        if(novo_idioma === "pt")
            idioma_selecionado = "pt-br";
        else if(novo_idioma === "en") {
            idioma_selecionado = "en-us";
            idioma_alterado = ":flag_us: | Language switched to `American English`";
        }else if(novo_idioma === "fr"){
            idioma_selecionado = "fr-fr";
            idioma_alterado = ":flag_fr: | Langue changée en `Français`";
        }

        client.channels.cache.get('872865396200452127').send(`${idioma_alterado.slice(0, 9)} | Idioma do servidor ( \`${message.guild.name}\` | \`${message.guild.id}\` ) atualizado para \`${idioma_selecionado}\``);

        client.idioma.setLang(message.guild.id, idioma_selecionado);
        message.reply(idioma_alterado);
    }
};