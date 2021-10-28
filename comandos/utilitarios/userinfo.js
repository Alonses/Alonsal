const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const { emojis_negativos } = require('../../arquivos/json/text/emojis.json');

module.exports = {
    name: "userinfo",
    description: "Veja detalhes de algum usuario",
    aliases: [ "usinfo", "usuarioinfo", "usif" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const getDateDiff = require('../../adm/diffdatas.js');
        const idioma_selecionado = client.idioma.getLang(message.guild.id);
        const {utilitarios} = require('../../arquivos/idiomas/' + idioma_selecionado + '.json');

        const ids_enceirados = ["597926883069394996", "665002572926681128", "610525028076748800", "678061682991562763", "813149555553468438", "434089428160348170", "735644852385087529"];

        let user = message.mentions.users.first() || message.author; // Coleta o ID do usuário
        let nota_rodape = "";

        const emoji_nao_encontrado = client.emojis.cache.get(emojis_negativos[Math.round((emojis_negativos.length - 1) * Math.random())]).toString();

        if (!user && args[0] != null) {
            if (isNaN(args[0]))
                return message.reply(":octagonal_sign: | " + utilitarios[4]["id_user"]);

            try {
                user = await message.guild.members.fetch(args[0]);

                user = user.user; // Pega o usuário pelo ID
            } catch (e) {
                return message.reply(emoji_nao_encontrado + " | " + utilitarios[4]["nao_conhecido"]);
            }
        }

        let avatar_user = 'https://cdn.discordapp.com/avatars/' + user.id + '/' + user.avatar + '.gif?size=512';
        const data_atual = new Date();

        const membro_sv = message.guild.members.cache.get(user.id); // Coleta dados como membro
        let data_entrada = new Date(membro_sv.joinedTimestamp);
        let diferenca_entrada = getDateDiff(data_entrada, data_atual, utilitarios);

        if (idioma_selecionado === "pt-br")
            data_entrada = data_entrada.getDate() + " de " + data_entrada.toLocaleString('pt', {month: 'long'}) + " de " + data_entrada.getFullYear() + " às " + ("0" + data_entrada.getHours()).substr(-2) + ":" + ("0" + data_entrada.getMinutes()).substr(-2);
        else
            data_entrada = data_entrada.toLocaleString('en', {month: 'long'}) + " " + data_entrada.getDate() + ", " + data_entrada.getFullYear() + " at " + ("0" + data_entrada.getHours()).substr(-2) + ":" + ("0" + data_entrada.getMinutes()).substr(-2);

        let data_criacao = new Date(user.createdAt); // Criação do servidor
        let diferenca_criacao = getDateDiff(data_criacao, data_atual, utilitarios);

        if (idioma_selecionado === "pt-br")
            data_criacao = data_criacao.getDate() + " de " + data_criacao.toLocaleString('pt', {month: 'long'}) + " de " + data_criacao.getFullYear() + " às " + ("0" + data_criacao.getHours()).substr(-2) + ":" + ("0" + data_criacao.getMinutes()).substr(-2);
        else
            data_criacao = data_criacao.toLocaleString('en', {month: 'long'}) + " " + data_criacao.getDate() + ", " + data_criacao.getFullYear() + " at " + ("0" + data_criacao.getHours()).substr(-2) + ":" + ("0" + data_criacao.getMinutes()).substr(-2);

        if (avatar_user !== null) {
            avatar_user = avatar_user.replace(".webp", ".gif");

            await fetch(avatar_user)
                .then(res => {
                    if (res.status !== 200)
                        avatar_user = avatar_user.replace('.gif', '.webp')
                });
        } else
            avatar_user = "";

        let apelido = user.username;
        if (membro_sv.nickname != null)
            apelido = membro_sv.nickname;

        if (user.bot)
            apelido = ":robot: " + apelido;

        if (membro_sv.permissions.has("ADMINISTRATOR")) {
            apelido = ":shield: " + apelido;
            nota_rodape = utilitarios[13]["moderador"];
        }

        if (user.id === client.user.id)
            nota_rodape = utilitarios[13]["alonsal"];

        if (ids_enceirados.includes(user.id)) {
            if (nota_rodape !== "")
                nota_rodape += ", ";

            nota_rodape += utilitarios[13]["enceirado"];
        }

        diferenca_entrada = diferenca_entrada.slice(0, -1);
        diferenca_criacao = diferenca_criacao.slice(0, -1);

        const permissoes_user = membro_sv.permissions.toArray();
        let permissoes_fn = "";

        for(let i = 0; i < permissoes_user.length; i++){

            if(typeof permissoes_user[i + 1] === "undefined")
                permissoes_fn += " & ";

            permissoes_fn += "`"+ permissoes_user[i] +"`";

            if(typeof permissoes_user[i + 2] !== "undefined")
                permissoes_fn += ", ";
        }

        permissoes_fn = permissoes_fn.slice(0, 2000);

        const infos_user = new MessageEmbed()
            .setTitle(apelido)
            .setColor(0x29BB8E)
            .setThumbnail(avatar_user)
            .addFields(
                {
                    name: ':globe_with_meridians: **Discord**',
                    value: "`" + user.username + "#" + user.discriminator + "`\n`" + user.id + "`",
                    inline: true
                },
                {
                    name: ':parachute: **' + utilitarios[13]["entrada"] + '**',
                    value: `\`${data_entrada}\`\n[ \`${diferenca_entrada}\` ]`,
                    inline: true
                },
                {
                    name: ':birthday: **' + utilitarios[13]["conta_criada"] + '**',
                    value: `\`${data_criacao}\`\n[ \`${diferenca_criacao}\` ]`,
                    inline: true
                }
            )
            .setFooter(nota_rodape);

        const permissoes = new MessageEmbed()
        .setTitle(apelido)
        .setColor(0x29BB8E)
        .setThumbnail(avatar_user)
        .addFields({
            name: "Permissões", value: `${permissoes_fn}`, inline: true
        })
        .setFooter(nota_rodape);

        let paginas = [
            infos_user,
            permissoes
        ];

        message.reply({embeds: [paginas[0]]});
        // let reacoes = ['◀️', '▶️'];

        // reacoes.forEach(async reacao => {
        //     await embed_pags.react(reacao);
        // });
        
        // const filter = (reaction, user) => ['◀️', '▶️'].includes(reaction.emoji.name) && user.id === message.author.id;
        // embed_pags.awaitReactions({ filter, max: 2, time: 20000, errors: ['time'] })
        // .then(collected => {
        //     const reaction = collected.first();
    
        //     if (reaction.emoji.name === '▶️')
        //         embed_pags.edit({embeds: [paginas[1]]});
        //     else
        //         embed_pags.edit({embeds: [paginas[0]]});
        // })
        // .catch(() => embed_pags.reactions.removeAll());
    }
}