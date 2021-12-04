const { arg } = require('mathjs');
const { emojis_dancantes } = require('../../arquivos/json/text/emojis.json');

let membros_sv = [];

let operacao_ativa = 0;
let updates = [0, 0, 0, 0];
let prefix;
let emoji_dancante;
let msg_feed;
let repeticao;

module.exports = {
    name: "add_cargos",
    description: "atribua um cargo para todos os membros do servidor",
    aliases: [ "car", "uncar" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        prefix = client.prefixManager.getPrefix(message.guild.id);
        emoji_dancante = client.emojis.cache.get(emojis_dancantes[Math.round((emojis_dancantes.length - 1) * Math.random())]).toString();

        // Permissões do bot e do usuário que executou o comando
        const permissions_user = await message.guild.members.fetch(message.author);
        const permissions_bot = await message.guild.members.fetch(message.client.user.id);
        
        if(!permissions_user.permissions.has('MANAGE_ROLES'))
            return message.reply(`:octagonal_sign: | ${moderacao[4]["permissao_1"]}`).then(msg => setTimeout(() => msg.delete(), 5000));

        if(!permissions_bot.permissions.has('MANAGE_ROLES') || !permissions_bot.permissions.has('ADMINISTRATOR'))
            return message.reply(`:octagonal_sign: | ${moderacao[4]["permissao_2"]}`).then(msg => setTimeout(() => msg.delete(), 5000));

        if(operacao_ativa && args[0].toString() == "cancel"){
            msg_feed.edit(`:octagonal_sign: | Operação cancelada\`\`\`fix\n👤Usuários atualizados: ${updates[1]}\n🚯Usuários ignorados: ${updates[2]} (já possuem o cargo)\n🤖Bots ignorados: ${updates[3]}\`\`\``);

            updates = [0, 0, 0, 0];
            membros_sv = [];
            operacao_ativa = 0;
            clearTimeout(repeticao);

            return;
        }

        if(!operacao_ativa){
            operacao_ativa = 1;
            membros_sv = [];
            updates = [0, 0, 0, 0];

            const { moderacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);
            if(args.length < 1) return message.reply("Informe um cargo para ser atribuido ou removido do usuário\nPor exemplo, `.acar @cargo` ou `.auncar @cargo`".replaceAll(".a", prefix));
    
            const list = client.guilds.cache.get(message.guild.id);
            await list.members.fetch()
            .then(members => { mbr = members.map(member => member.id);
                membros_sv.push(mbr); // ID's dos membros do servidor
            });


            try{
                cargo = args[0].value.id;
            }catch(err){
                operacao_ativa = 0;
                return message.reply("Este cargo não existe nesse servidor")
            }

            const verifica_cargo = message.guild.roles.cache.get(cargo)
            if(!verifica_cargo){
                operacao_ativa = 0;
                return message.reply("Este cargo não existe nesse servidor")   
            }
        
            membros_sv = membros_sv[0];
            updates[0] = membros_sv.length; // membros_sv_original ( tbm conta bots )

            await message.reply("Escreva `.acar cancel` para cancelar a operação".replace(".a", prefix));
            msg_feed = await message.reply(`${emoji_dancante} | Atualizando usuários: \`1 de ${membros_sv.length}\``);
            alterar_users(cargo, client, message, 0);
        }else
            message.reply("Há uma operação ativa no momento");
    }
}

async function alterar_users(cargo, client, message, contador){
    
    let member = await message.guild.members.fetch(membros_sv[0]); // Coleta

    if(!member.user.bot){ // Atualiza apenas usuários que não são bots
        if(message.content.split(" ")[0] == `${prefix}car`)
            if(!member.roles.cache.has(cargo)) // Adicionando
                await member.roles.add(cargo).then(updates[1] += 1).catch(console.error);
            else
                updates[2] += 1;
        else if(message.content.split(" ")[0] == `${prefix}uncar`)
            if(member.roles.cache.has(cargo)) // Removendo
                await member.roles.remove(cargo).then(updates[1] += 1).catch(console.error);
            else
                updates[2] += 1;
    }else
        updates[3] += 1;

    contador++;

    repeticao = setTimeout(() => {
        membros_sv.shift();

        if(membros_sv.length > 0){
            msg_feed.edit(`${emoji_dancante} | Atualizando usuários: \`${contador} de ${updates[0]}\``);
            alterar_users(cargo, client, message, contador);
        }else{
            operacao_ativa = 0;
            msg_feed.edit(`:checkered_flag: | Operação concluída\`\`\`fix\n👤Usuários atualizados: ${updates[1]}\n🚯Usuários ignorados: ${updates[2]} (já possuem o cargo)\n🤖Bots ignorados: ${updates[3]}\`\`\``);
        }
    }, 1500);
}