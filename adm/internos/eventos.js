let ult_comando;
let ult_mensagem;
let conexoes_ativas = 0;

let { prefix } = require('../../config.json');
const { MessageEmbed } = require('discord.js');

const canais_conectados = new Map();
const servers_conectados = new Map();

module.exports = async function({client, auto, ult_comand, ult_message}){

    if(auto){
        if(typeof ult_comand !== "undefined")
            ult_comando = ult_comand;

        if(typeof ult_message !== "undefined")
            ult_mensagem = ult_message;
        
        return;
    }

    client.on("guildCreate", guild => {
        let caso = 'New';
        require("./servers.js")({client, caso, guild});
    });
    
    client.on("guildDelete", guild => {
        let caso = 'Left';
        require("./servers.js")({client, caso, guild});
    });
    
    client.on("voiceStateUpdate", guild => {
        
        if(guild.guild.client.voice.connections.size < conexoes_ativas){
            // Processa quando o bot é desconectado do canal por um usuário manualmente
            conexoes_ativas--;

            const id_canal_desconectado = guild.channelID; // Canal de voz
            
            let id_canal_comando = servers_conectados.get(guild.guild.id); // Canal de texto 
            let id_mensagem = canais_conectados.get(guild.guild.id);
            
            const channel = client.channels.cache.get(id_canal_comando);
            const message = channel.messages.cache.get(id_mensagem);
    
            const args = message.content.slice(prefix.length).trim().split(' ');

            require('../../comandos/musicas/play.js')({message, client, args, id_canal_desconectado});
            
            servers_conectados.set(guild.guild.id, []);
            canais_conectados.set(guild.guild.id, []);
        }else{ // Salva num mapa os comandos quando há atualizações nos canais de voz
            if(typeof ult_mensagem !== "undefined"){
                conexoes_ativas = guild.guild.client.voice.connections.size;
            
                servers_conectados.set(ult_mensagem.guild.id, ult_mensagem.channel.id);
                canais_conectados.set(ult_mensagem.guild.id, ult_mensagem.id);
            }
        }
    });
    
    client.on("rateLimit", limit => {
        const embed = new MessageEmbed()
        .setTitle("> RateLimit :name_badge:")
        .setColor(0xff0000)
        .setDescription(`Command: \`${ult_comando}\`\nTimeout: \`${limit.timeout}\`\nLimit: \`${limit.limit}\`\nMethod: \`${limit.method}\`\n\nPath: \`${limit.path}\`\nRoute: \`${limit.route}\``);
    
        client.channels.cache.get('862015290433994752').send({ embeds: [embed] });
    });
}