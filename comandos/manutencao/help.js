const Discord = require('discord.js');

module.exports = async({message}) => {

    const embed = new Discord.MessageEmbed()
    .setTitle('Segura os comandos Alonsais!')
    .setColor(0x29BB8E)
    .setDescription('> PREFIXO ( **.a** ) \n-----------------------------\n> DIVERSON\n:innocent: **`.apaz`** | **`.apz`** - União\n:yum: **`.asfiha`** | **`.asf`** - Servidos?\n:rage: **`.abriga`** | **`.ab`** - Porradaria!\n:cow: **`.agado @Alonsal`** | **`.aga @Alonsal`** - Teste a Gadisse de alguém\n:raised_hands: **`.abaidu`** | **`.adu`** - Louvado seja!\n:chess_pawn: **`.apiao`** | **`.api`** - Roda o pião Dona Maria!\n:blue_book: **`.acuri`** | **`.ac`** - Uma curiosidade aleatória\n:black_joker: **`.ajoke`** | **`.aj`** - Invoca uma piada\n:clown: **`.acazalbe`** | **`.acaz`** - Cazalbe!\n-----------------------------\n> UTILITÁRIOS\n:ping_pong: **`.aping`** | **`.ap`** - Calcula seu ping\n:musical_note: **`.ash`** - Comandos de música\n:symbols: **`.am 8&7!`** | **`.am ---.. .-... --...`** - Converte em morse e traduz\n:one: **`.abn Alonso`** | **`.abn 11100011`** - Converte em binário e traduz\n:arrow_backward: **`.arev Alonso`** - Inverte o texto digitado\n:mag: **`.awiki Alonso`** | **`.aw Alonso`** - Pesquisa na wikipedia (en-US)\n:clock1230: **`.ahora`** | **`.aho`** - Mostra a hora\n-----------------------------\n> JOOJS\n:scissors: **`.ajkp papel`** | **`.ajkp`** - Jokenpô\n:coin: **`.acoin cara`** | **`.aco coroa`** - Teste sua sorte\n:game_die: **`.adado`** | **`.ada`** - Roda um dado\n-----------------------------\n> MANUTENÇON\n:information_source: **`.ainfo`** | **`.ai`** - Informações do bot\n:envelope: **`.amail <sua msg>`** - Envie uma mensagem para o bot :P\n:love_letter: **`.acvv`** | **`.aconvite`** - Convide-me para um Servidor!');

    message.channel.send(embed);
}