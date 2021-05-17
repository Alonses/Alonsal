const Discord = require('discord.js');

module.exports = async({message}) => {

    const embed = new Discord.MessageEmbed()
    .setTitle('Segura os comandos Alonsais!')
    .setColor(0x29BB8E)
    .setDescription('> PREFIXO ( **ã** ) \n-----------------------------\n> DIVERSON\n:innocent: **`ãpaz`** | **`ãpz`** - União\n:yum: **`ãsfiha`** | **`ãsf`** - Servidos?\n:rage: **`ãbriga`** | **`ãb`** - Porradaria!\n:cow: **`ãgado @Alonsal`** | **`ãga @Alonsal`** - Teste a Gadisse de alguém\n:raised_hands: **`ãbaidu`** | **`ãdu`** - Louvado seja!\n:chess_pawn: **`ãpiao`** | **`ãpi`** - Roda o pião Dona Maria!\n:clown: **`ãcazalbe`** | **`ãcaz`** - Cazalbe!\n-----------------------------\n> UTILITÁRIOS\n:ping_pong: **`ãping`** | **`ãp`** - Calcula seu ping\n:clock1230: **`ãhora`** | **`ãho`** - Mostra a hora\n:game_die: **`ãdado`** | **`ãda`** - Roda um dado\n:blue_book: **`ãcuri`** | **`ãc`** - Uma curiosidade aleatória\n:black_joker: **`ãjoke`** | **`ãj`** - Invoca uma piada\n-----------------------------\n> JOOJS\n:scissors: **`ãjkp papel`** | **`ãrps pedra`** - Jokenpô\n-----------------------------\n> MANUTENÇÕN\n:information_source: **`ãinfo`** | **`ãi`** - Informações do bot');

    message.channel.send(embed);
}