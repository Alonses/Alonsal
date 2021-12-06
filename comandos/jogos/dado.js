module.exports = {
    name: "dado",
    description: "Rode um ou vários dados com várias faces",
    aliases: [ "da", "dice", "di" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const idioma_definido = client.idioma.getLang(message.guild.id);
        const {jogos} = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

        const prefix = client.prefixManager.getPrefix(message.guild.id);

        const dado = [];
        let resultado = "";
        let att_auto = 0;

        if (typeof args[0] === "undefined")
            args[0] = 1;

        if (args.length > 0) {
            if (isNaN(Number(args[0].raw))) // Caracteres de texto
                return message.reply(`:warning: | ${jogos[2]["aviso_1"]}`);

            if (typeof args[1] !== "undefined")
                if (isNaN(Number(args[1].raw))) // Caracteres de texto
                    return message.reply(`:warning: | ${jogos[2]["aviso_1"]}`);

            if (Number(args[0].raw) > 50) // Mais que 50 dados
                return message.reply(`:warning: | ${jogos[2]["error_1"]}`);

            if (Number(args[0].raw) < 1) // Menos que 1 dado
                return message.reply(`:warning: | ${jogos[2]["aviso_2"].replaceAll(".a", prefix)}`);

            if (typeof args[1] === "undefined") {
                args[1] = 5;
                att_auto = 1;
            } else {
                if (args[1].raw > 10000) // Mais que 10.000 faces
                    return message.reply(`:warning: | ${jogos[2]["error_2"]}`);

                if (args[1].raw < 4) // Menos que 4 faces
                    return message.reply(`:warning: | ${jogos[2]["error_3"]}`);
            }

            for (let i = 0; i < Number(args[0].raw); i++) { // Rodar os dados
                dado.push(1 + Math.round((args[1].raw - 1) * Math.random()));
            }
        }

        for (let i = 0; i < dado.length; i++) {
            resultado += `\`${dado[i].toLocaleString('pt-BR')}\``;

            if (typeof dado[i + 1] != "undefined")
                resultado += ", ";
        }

        if (att_auto === 1)
            args[1].raw++;

        let mensagem = `Foram rodados \`${args[0].raw}\` sólidos geométricos com \`${Number(args[1].raw).toLocaleString('pt-BR')}\` faces\n\nResultados [ ${resultado} ]`;

        if (idioma_definido === "en-us")
            mensagem = `Rotated \`${args[0].raw}\` geometric solids with \`${Number(args[1].raw).toLocaleString('pt-BR')}\` faces\n\nResults [ ${resultado} ]`;

        if (Number(args[0].raw) === 1) {
            mensagem = `Foi rodado \`1\` sólido geométrico com \`${Number(args[1].raw).toLocaleString('pt-BR')}\` faces\n\nResultado [ ${resultado} ]`;

            if (idioma_definido === "en-us")
                mensagem = `Run \`1\` geometric solid with \`${Number(args[1]).toLocaleString('pt-BR')}\` faces\n\nResult [ ${resultado} ]`;
        }

        message.reply(`:game_die: ${mensagem}`);
    }
};