const CEIRA_ADICIONAL = 2;
const LIMIT = 5;
const DIFF = 5000;
const CALDEIRA = 60000;

const { existsSync, mkdirSync, writeFileSync } = require('fs');

module.exports = async (client, message) => {

    if (!existsSync(`./arquivos/data/rank/${message.guild.id}`))
        mkdirSync(`./arquivos/data/rank/${message.guild.id}`, { recursive: true });

    const user = {
        id: message.author.id,
        nickname: message.author.username,
        lastValidMessage: 0,
        warns: 0,
        caldeira_de_ceira: false,
        xp: 0
    };

    if (existsSync(`./arquivos/data/rank/${message.guild.id}/${user.id}.json`)) {
        delete require.cache[require.resolve(`../arquivos/data/rank/${message.guild.id}/${user.id}.json`)];
        const { xp, lastValidMessage, warns, caldeira_de_ceira } = require(`../arquivos/data/rank/${message.guild.id}/${user.id}.json`);
        user.xp = xp;
        user.warns = warns;
        user.lastValidMessage = lastValidMessage;
        user.caldeira_de_ceira = caldeira_de_ceira;
    }

    if (user.warns >= LIMIT) {
        user.caldeira_de_ceira = true;
        user.warns = 0;
        writeFileSync(`./arquivos/data/rank/${message.guild.id}/${user.id}.json`, JSON.stringify(user));
        return;
    }

    if (user.caldeira_de_ceira) {
        if (message.createdTimestamp - user.lastValidMessage > CALDEIRA)
            user.caldeira_de_ceira = false;
        else
            return;
    }

    if (message.createdTimestamp - user.lastValidMessage < DIFF) {
        user.warns++;
        writeFileSync(`./arquivos/data/rank/${message.guild.id}/${user.id}.json`, JSON.stringify(user));
        return;
    }

    user.xp += CEIRA_ADICIONAL;
    user.lastValidMessage = message.createdTimestamp;
    user.warns = 0;

    writeFileSync(`./arquivos/data/rank/${message.guild.id}/${user.id}.json`, JSON.stringify(user));

    delete require.cache[require.resolve(`../arquivos/data/rank/${message.guild.id}/${user.id}.json`)];
}