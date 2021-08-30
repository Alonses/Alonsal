module.exports = {
    name: "ping",
    description: "Veja seu ping local",
    aliases: [ "p" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const { emojis } = require('../../arquivos/json/text/emojis.json');
        
        function emoji(id){
            return client.emojis.cache.get(id).toString();
        }

        const emoji_barata = emoji(emojis.dancando_barata);
        const emoji_steve = emoji(emojis.dancando_steve);
        const emoji_pare = emoji(emojis.pare_agr);

        const m = await message.lineReply("Ping?");
        let delay = m.createdTimestamp - message.createdTimestamp;

        let mensagem = ':ping_pong: Pong! [ **`'+ delay +'ms`** ] Tá lagado um poko tô renderizando vídeo '+ emoji_barata;
        
        if(delay < 200)
            mensagem = ':ping_pong: Pong! [ **`'+ delay +'ms`** ] Tudo numa boa!';

        if(delay < 100)
            mensagem = ':ping_pong: Pong! [ **`'+ delay +'ms`** ] Dá até para jogar de olhos fechados! '+ emoji_steve;

        if(delay > 600)
            mensagem = ':ping_pong: Pong! [ **`'+ delay +'ms`** ] Pode jogar fora esse teu roteador! '+ emoji_pare;

        mensagem += "\nLatência do Alonsal [ **`"+ Math.round(client.ws.ping) + "ms`** ]";

        m.edit(mensagem);
    }
};