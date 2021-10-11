module.exports = {
    name: "ban",
    description: "expulsa algum usuário do servidor",
    aliases: [ "" ],
    cooldown: 3,
    permissions: [ "ADMINISTRATOR" ],
    async execute(client, message, args) {
    
        let alvo = message.mentions.users.first() || message.author;

        message.lineReply(`Dando uma esfihada no ${alvo}`);
    }
}