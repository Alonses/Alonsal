const { emojis, emojis_dancantes, emojis_negativos } = require('../../arquivos/json/text/emojis.json');

module.exports = {
    name: "emj",
    description: "Altere o avatar do alonsal",
    aliases: [ "" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        emojis_negativos.forEach(async emoji => {

            setTimeout(async () => {
                let emoji_pula = client.emojis.cache.get(emoji).toString();
                await client.channels.cache.get("903289286546296842").send(emoji_pula);
            }, 1000);
        });

    }
}