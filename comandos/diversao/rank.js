const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "rank",
    description: "Veja seu rank no servidor",
    aliases: [ "r" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args){

        setTimeout(async () => {
            const { rank_servidores } = require('../../arquivos/data/rank/ranking.json');
            let users_sv = [];

            for(let i = 0; i < rank_servidores.length; i++){

                // if(args[0] !== "global" && args[0] !== "g"){
                    if(typeof rank_servidores[i][message.guild.id] != "undefined"){
                        users_sv = rank_servidores[i][message.guild.id];
                        break;
                    }
                // }else{
                    // let id_server = Object.keys(rank_servidores[i])[0];
                    // for(let x = 0; x < rank_servidores[i][id_server].length; x++){
                        // users_sv.push(rank_servidores[i][id_server][x]);
                    // }
                // }
            }
            
            let lista_usuarios = [];
            let experiencia = [];
            for(let i = 0; i < users_sv.length; i++){
                lista_usuarios.push(users_sv[i]["user"]);
                experiencia.push(users_sv[i]["exp"]);
            }

            for (let i = 1; i < experiencia.length; i++) { // Ordena os arrays do maior para o menor
                for (let j = 0; j < i; j++) {
                    if (experiencia[i] > experiencia[j]) {
                        let temp = experiencia[i];
                        experiencia[i] = experiencia[j];
                        experiencia[j] = temp;

                        let temp2 = lista_usuarios[i];
                        lista_usuarios[i] = lista_usuarios[j];
                        lista_usuarios[j] = temp2;
                    }
                }
            }

            let lista_final_nomes = "";
            let lista_final_exp = "";
            let medalhas = [":first_place:", ":second_place:", ":third_place:", ":medal:", ":medal:", ":medal:"];

            let qtd_entradas = 5;

            if(lista_usuarios.length < 5)
                qtd_entradas = lista_usuarios.length;

            for(let i = 0; i < qtd_entradas; i++){ // Exibe apenas os 6 usuários com mais exp
                lista_final_nomes += medalhas[i] +` \`${lista_usuarios[i].replace(/ /g, "")}\`\n`;
                lista_final_exp += `\`${experiencia[i]}\`\n`;
            }

            let icone_server = message.guild.iconURL({ size: 2048 });
            icone_server = icone_server.replace(".webp", ".gif");

            fetch(icone_server)
            .then(res => {
                if(res.status !== 200)
                    icone_server = icone_server.replace('.gif', '.webp')

                const rank_sv = new MessageEmbed()
                .setTitle("Rank de "+ message.guild.name)
                .setColor(0x29BB8E)
                .setThumbnail(icone_server)
                .addFields(
                    { name: ":hot_face: Enceirados", value: lista_final_nomes, inline: true},
                    { name: ":postal_horn: Experiência", value: lista_final_exp, inline: true}
                    )
                .setFooter(message.author.username, message.author.avatarURL({dynamic: true}));

                message.reply({ embeds: [rank_sv] });

                delete require.cache[require.resolve('../../arquivos/data/rank/ranking.json')];
            });
        }, 500);
    }
}