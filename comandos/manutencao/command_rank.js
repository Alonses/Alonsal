const fetch = require("node-fetch");
const { readdirSync } = require("fs");
const { MessageEmbed } = require('discord.js');
const busca_emoji = require("../../adm/funcoes/busca_emoji");
const { emojis } = require('../../arquivos/json/text/emojis.json');

const medals = {
    0: ":first_place:",
    1: ":second_place:",
    2: ":third_place:"
};

module.exports = {
    name: "command_rank",
    description: "Veja seu rank de comandos ativos",
    aliases: [ "rc", "comandos", "commands" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
        
        let idioma = client.idioma.getLang(message.guild.id);

        const { diversao } = require(`../../arquivos/idiomas/${idioma}.json`);
        const prefix = client.prefixManager.getPrefix(message.guild.id);
        const emoji_ceira = busca_emoji(client, emojis.mc_honeycomb);

        const commands = [];
        let rodape = message.author.username;

        if(idioma == "al-br") idioma = "pt-br";

        fetch(`https://raw.githubusercontent.com/odnols/site-do-alonsal/main/json/guia_${idioma.slice(0, 2)}.json`)
        .then(response => response.json())
        .then(async dados => {
            for (const file of readdirSync(`./arquivos/data/command_rank`)) {
                commands.push(require(`../../arquivos/data/command_rank/${file}`));
            }

            commands.sort(function (a, b) {
                return (a.activations < b.activations) ? 1 : ((b.activations < a.activations) ? -1 : 0);
            });

            commands.sort();

            const conames = [];
            const activations = [];
            const aliases = [];
    
            const pages = commands.length / 6;
            const paginas = commands.length > 6 ? Math.floor(pages) + 1 : Math.floor(pages);


            if (commands.length > 6)
                rodape = `( 1 | ${paginas} ) - ${paginas} ${diversao[8]["rodape_rc"]}`.replace(".a", prefix);
            
            if (args[0] && parseInt(args[0].raw) > 1) {
                if(parseInt(args[0].raw) > paginas) return message.reply(`:octagonal_sign: | ${diversao[8]["paginas"]}`)
                
                rodape = `( ${parseInt(args[0].raw)} | ${paginas} ) - ${paginas} ${diversao[8]["rodape_rc"]}`.replace(".a", prefix);

                const remover = parseInt(args[0].raw) === paginas ? (parseInt(args[0].raw) - 1) * 6 : commands.length % 6 !== 0 ? parseInt(args[0].raw) !== 2 ? (parseInt(args[0].raw) - 2) * 6 : (parseInt(args[0].raw) - 1) * 6 : (parseInt(args[0].raw) - 1) * 6 ;
                
                for(let x = 0; x < remover; x++){
                    commands.shift();
                }
            }

            let i = 0;

            for (const command of commands) {
                if(i < 6){
                    let command_name = dados.guia[command.id];
                    command_name = `${command_name.emoji} ${(command_name.comando).split(" ")[0]}` || diversao[8]["nome_faltando"];
                    
                    let comaliase = dados.guia[command.id];
                    comaliase = (comaliase.aliases).split(",")[0] || diversao[8]["aliase_faltando"];
                    
                    if(comaliase == ".asus"){
                        command_name = dados.guia[command.id];
                        command_name = `👤 ${(command_name.comando).split(" ")[0]}` || diversao[8]["nome_faltando"];
                    }

                    if (args[0] && args[0].type === "number" && parseInt(args[0].raw) !== 1)
                        conames.push(`:gear: \`${command_name}\``); 
                    else
                        conames.push(`${medals[i] || ":gear:"} \`${command_name}\``);
                
                    activations.push(`\`${formata_num(command.activations)}\``);
                    aliases.push(`\`${prefix}${command.aliases[0].replace(/ /g, "")}\``);
                }

                i++
            }

            embed = new MessageEmbed()
            .setTitle(`${diversao[8]["rank_rc"]}`)
            .setColor(0x29BB8E)
            .setDescription(`\`\`\`fix\n${diversao[8]["historia_alonsal"]}\`\`\``)
            .setFooter(rodape, message.author.avatarURL({dynamic: true}));
        
            embed.addField(`${emoji_ceira} ${diversao[8]["comandos"]}`, `${conames.join("\n")}`, true);
            embed.addField(`:postal_horn: Aliase`, `${aliases.join("\n")}`, true);
            embed.addField(`:postal_horn: ${diversao[8]["ativacoes"]}`, `${activations.join("\n")}`, true);

            message.reply({ embeds: [embed] });
        })
        .catch((e) => {
            console.log(e);
            message.reply(`:mag: | ${diversao[8]["error_rc"]}`);
        });
    }
}

function formata_num(valor){
    let sparkles = valor % 100 == 0 ? " ✨" : "";

    return `${parseInt(valor).toLocaleString('pt-BR')}${sparkles}`;
}