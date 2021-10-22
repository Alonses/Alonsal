module.exports = {
    name: "ping",
    description: "Veja seu ping local",
    aliases: [ "p" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
        const { utilitarios } = require('../../arquivos/idiomas/'+ client.idioma.getLang(message.guild.id) +'.json');

        const { emojis } = require('../../arquivos/json/text/emojis.json');
        
        function emoji(id){
            return client.emojis.cache.get(id).toString();
        }

        const emoji_barata = emoji(emojis.dancando_barata);
        const emoji_steve = emoji(emojis.dancando_steve);
        const emoji_pare = emoji(emojis.pare_agr);

        const m = await message.reply("Ping?");
        let delay = m.createdTimestamp - message.createdTimestamp;

        let mensagem = ':ping_pong: Pong! [ **`'+ delay +'ms`** ] '+ utilitarios[0]["ping_1"] +' '+ emoji_barata;
        
        if(delay < 200)
            mensagem = ':ping_pong: Pong! [ **`'+ delay +'ms`** ] '+ utilitarios[0]["ping_2"];

        if(delay < 100)
            mensagem = ':ping_pong: Pong! [ **`'+ delay +'ms`** ] '+ utilitarios[0]["ping_3"] +' '+ emoji_steve;

        if(delay > 600)
            mensagem = ':ping_pong: Pong! [ **`'+ delay +'ms`** ] '+ utilitarios[0]["ping_4"] +' '+ emoji_pare;

        mensagem += "\n"+ utilitarios[0]["latencia"] +" [ **`"+ Math.round(client.ws.ping) + "ms`** ]";

        m.edit(mensagem);
    }
};