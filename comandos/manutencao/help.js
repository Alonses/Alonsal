const Discord = require('discord.js');

module.exports = async({message}) => {

    const embed = new Discord.MessageEmbed()
    .setTitle('Segura os comandos Alonsais!')
    .setColor(0x29BB8E)
    .setDescription('> PREFIXO ( **ã** ) \n-----------------------------\n> DIVERSON\n:innocent: **`ãpaz`** | **`ãpz`** - União\n:yum: **`ãsfiha`** | **`ãsf`** - Servidos?\n:rage: **`ãbriga`** | **`ãb`** - Porradaria!\n:cow: **`ãgado @Alonsal`** | **`ãga @Alonsal`** - Teste a Gadisse de alguém\n:raised_hands: **`ãbaidu`** | **`ãdu`** - Louvado seja!\n:chess_pawn: **`ãpiao`** | **`ãpi`** - Roda o pião Dona Maria!\n:blue_book: **`ãcuri`** | **`ãc`** - Uma curiosidade aleatória\n:black_joker: **`ãjoke`** | **`ãj`** - Invoca uma piada\n:clown: **`ãcazalbe`** | **`ãcaz`** - Cazalbe!\n-----------------------------\n> UTILITÁRIOS\n:ping_pong: **`ãping`** | **`ãp`** - Calcula seu ping\n:musical_note: **`ãsth`** - Comandos de música\n:symbols: **`ãm 8&7!`** | **`ãm ---.. .-... --...`** - Converte em morse e traduz\n:one: **`ãbn Alonso`** | **`ãbn 11100011`** - Converte em binário e traduz\n:arrow_backward: **`ãrev Alonso`** - Inverte o texto digitado\n:mag: **`ãwiki Alonso`** | **`ãw Alonso`** - Pesquisa na wikipedia (en-US)\n:clock1230: **`ãhora`** | **`ãho`** - Mostra a hora\n-----------------------------\n> JOOJS\n:scissors: **`ãjkp papel`** | **`ãrps pedra`** - Jokenpô\n:coin: **`ãcoin cara`** | **`ãco coroa`** - Teste sua sorte\n:game_die: **`ãdado`** | **`ãda`** - Roda um dado\n-----------------------------\n> MANUTENÇON\n:information_source: **`ãinfo`** | **`ãi`** - Informações do bot\n:envelope: **`ãmail <sua msg>`** - Envie alguma mensagem para o bot :P\n:love_letter: **`ãcvv`** | **`ãconvite`** - Convide-me para um Servidor!');

    message.channel.send(embed);
}
