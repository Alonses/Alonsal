const busca_emoji = require('../../adm/funcoes/busca_emoji');
const { emojis } = require('../../arquivos/json/text/emojis.json');

module.exports = {
    name: "ping",
    description: "Veja seu ping",
    aliases: [ "p" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message) {
        const { utilitarios } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);
      
        const dancando_thanos = busca_emoji(client, emojis.dancando_thanos);
        const emoji_steve = busca_emoji(client, emojis.dancando_steve);
        const emoji_pare = busca_emoji(client, emojis.pare_agr);
        const susto2 = busca_emoji(client, emojis.susto2);

        const m = await message.reply("Ping?");
        const delay = m.createdTimestamp - message.createdTimestamp;

        let mensagem = `:ping_pong: Pong! [ **\`${delay}ms\`** ] ${utilitarios[0]["ping_1"]} ${dancando_thanos}`;
        
        if(delay < 200)
            mensagem = `:ping_pong: Pong! [ **\`${delay}ms\`** ] ${utilitarios[0]["ping_2"]}`;

        if(delay < 100)
            mensagem = `:ping_pong: Pong! [ **\`${delay}ms\`** ] ${utilitarios[0]["ping_3"]} ${emoji_steve}`;

        if(delay > 600)
            mensagem = `:ping_pong: Pong! [ **\`${delay}ms\`** ] ${utilitarios[0]["ping_4"]} ${emoji_pare}`;

        if(delay <= 0)
            mensagem = `:ping_pong: Pong!? [ **\`${delay}ms\`** ] ${utilitarios[0]["ping_5"]} ${susto2}`;

        mensagem += `\n${utilitarios[0]["latencia"]} [ **\`${Math.round(client.ws.ping)}ms\`** ]`;

        m.edit(mensagem);
    }
};