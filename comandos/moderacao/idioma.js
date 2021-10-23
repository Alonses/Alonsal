module.exports = {
    name: "idioma",
    description: "Veja seu ping local",
    aliases: [ "language", "lang" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
        let prefix = client.prefixManager.getPrefix(message.guild.id);

        const { moderacao } = require('../../arquivos/idiomas/'+ client.idioma.getLang(message.guild.id) + '.json');

        if(!message.member.permissions.has('MANAGE_GUILD') && !client.owners.contains(message.owner.id))
            return message.reply(":octagonal_sign: | "+ moderacao[3]["permissao_1"]); // Libera configuração para o Slondo e adms apenas

        let idioma_selecionado;

        if(args[0] !== "pt" && args[0] !== "en")
            return message.reply(moderacao[0]["error"].replaceAll(".a", prefix));
        else
            idioma_selecionado = "pt-br";


        let idioma_alterado = ":flag_br: | Idioma alterado para `Português Brasileiro`";

        if(args[0] === "pt")
            idioma_selecionado = "pt-br";
        else if(args[0] === "en") {
            idioma_selecionado = "en-us";
            idioma_alterado = ":flag_us: | Language switched to `American English`";
        }

        client.idioma.setLang(message.guild.id, idioma_selecionado)

        message.reply(idioma_alterado);
    }
};