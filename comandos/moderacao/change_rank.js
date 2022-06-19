const { existsSync, writeFileSync } = require('fs');
const busca_emoji = require('../../adm/funcoes/busca_emoji');
const { emojis_negativos } = require('../../arquivos/json/text/emojis.json');

module.exports = {
    name: "changerank",
    description: "Altere o rank de algum membro",
    aliases: [ "chr" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
        
        const prefix = client.prefixManager.getPrefix(message.guild.id);
        const { moderacao, utilitarios } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);
        const permissions_user = await message.guild.members.fetch(message.author);
        let alvo;
        const emoji_nao_encontrado = busca_emoji(client, emojis_negativos);

        if(args.length < 1 || (isNaN(args[0].raw) && args.length == 1)) return message.reply(`:octagonal_sign: | ${moderacao[8]["error_1"].replace(".a", prefix)}`);

        if ((!permissions_user.permissions.has('MODERATE_MEMBERS')) && message.author.id !== "665002572926681128")
            return message.reply(`:octagonal_sign: | ${moderacao[8]["permissao_1"]}`).then(msg => setTimeout(() => msg.delete(), 5000));
        
        //  Buscando o Alvo informado
        if(!alvo && args.length > 0 && args[0].raw.length === 18){
            if (isNaN(Number(args[0].raw))) // Verifica se é um ID realmente
                return message.reply(`:octagonal_sign: | ${utilitarios[4]["id_user"]}`);

            try{ // Busca pelo usuário no server inteiro
                alvo = await message.guild.members.fetch(args[0].raw);
                alvo = alvo.user; // Separa os dados de usuário
            }catch(e){
                return message.reply(`${emoji_nao_encontrado} | ${utilitarios[4]["nao_conhecido"]}`);
            }
        }

        if (!alvo) return message.reply(`:mag: | ${moderacao[8]["error_1"].replace(".a", prefix)}`);

        const user = {
            id: alvo.id,
            nickname: alvo.username,
            lastValidMessage: 0,
            warns: 0,
            caldeira_de_ceira: false,
            xp: 0
        };
        
        if (existsSync(`./arquivos/data/rank/${message.guild.id}/${alvo.id}.json`)) {
            delete require.cache[require.resolve(`../../arquivos/data/rank/${message.guild.id}/${alvo.id}.json`)];
            const { xp, lastValidMessage, warns, caldeira_de_ceira } = require(`../../arquivos/data/rank/${message.guild.id}/${alvo.id}.json`);
            user.xp = xp;
            user.warns = warns;
            user.lastValidMessage = lastValidMessage;
            user.caldeira_de_ceira = caldeira_de_ceira;
        }

        let novo_exp;
        if(args.length === 1)
            novo_exp = parseInt(args[0].raw);
        
        if(args.length === 2)
            novo_exp = parseInt(args[1].raw);

        if(isNaN(novo_exp)) return message.reply(`:octagonal_sign: | ${moderacao[8]["error_1"].replace(".a", prefix)}`);

        user.xp = parseInt(novo_exp);
        novo_nivel = parseInt(novo_exp / 1000);

        try{
            writeFileSync(`./arquivos/data/rank/${message.guild.id}/${alvo.id}.json`, JSON.stringify(user));
            delete require.cache[require.resolve(`../../arquivos/data/rank/${message.guild.id}/${alvo.id}.json`)];
        }catch(err){
            console.log(err);
            return message.reply(`:octagonal_sign: | ${moderacao[8]["error_2"]}`);
        }

        message.reply(`:military_medal: | ${moderacao[8]["sucesso"].replace("nick_repl", user.nickname).replace("exp_repl", novo_exp).replace("nivel_repl", novo_nivel)}`);
    }
}