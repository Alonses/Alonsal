module.exports = {
    name: "idioma",
    description: "Altere o idioma do alonsal",
    aliases: [ "language", "lang" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
        
        const { moderacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

        if(!message.member.permissions.has('MANAGE_GUILD') && !client.owners.includes(message.author.id))
            return message.reply(`:octagonal_sign: | ${moderacao[3]["permissao_1"]}`).then(msg => setTimeout(() => msg.delete(), 5000)); // Libera configuração para o Slondo e adms apenas

        let prefix = client.prefixManager.getPrefix(message.guild.id);
        let idioma_selecionado;        
        let novo_idioma = message.content.split(" ")[1];

        if(novo_idioma !== "pt" && novo_idioma !== "en")
            return message.reply(`:interrobang: | ${moderacao[0]["error"].replaceAll(".a", prefix)}`);
        else
            idioma_selecionado = "pt-br";

        let idioma_alterado = ":flag_br: | Idioma alterado para `Português Brasileiro`";

        if(novo_idioma === "pt")
            idioma_selecionado = "pt-br";
        else if(novo_idioma === "en") {
            idioma_selecionado = "en-us";
            idioma_alterado = ":flag_us: | Language switched to `American English`";
        }

        client.channels.cache.get('872865396200452127').send(`${idioma_alterado.slice(0, 9)} | Idioma do servidor ( \`${message.guild.name}\` | \`${message.guild.id}\` ) atualizado para \`${idioma_selecionado}\``);

        client.idioma.setLang(message.guild.id, idioma_selecionado);
        message.reply(idioma_alterado);
    }
};