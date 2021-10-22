const { MessageEmbed } = require('discord.js');
const { id_canais } = require('../config.json');

module.exports = async ({client, caso, guild}) => {

    let ocasiao = "> Server update ( New )";
    let cor = 0x29BB8E;
    let canais = guild.channels.cache.filter((c) => c.type !== "GUILD_CATEGORY").size;

    if(caso === "Left"){
        ocasiao = "> Server update ( Left )";
        cor = 0xd4130d;
    }

    const embed_sv = new MessageEmbed()
        .setTitle(ocasiao)
        .setColor(cor)
        .setDescription(":globe_with_meridians: (ID) Server: `"+ guild.id +"`\n:label: Server name: `"+ guild.name +"`\n\n:busts_in_silhouette: Members: `"+ (guild.memberCount - 1) +"`\n:placard: Channels: `"+ canais +"`")
        .setTimestamp();

    client.channels.cache.get(id_canais[0]).send({ embeds : [embed_sv] });

    const canal = await client.channels.cache.get(guild.systemChannelId);
    const prefix = client.prefixManager.getPrefix(guild.id)

    if (canal.type === "GUILD_TEXT") {
        const permissions = canal.permissionsFor(client.user);

        if (!permissions.has("SEND_MESSAGES")) return; // Permissão para enviar mensagens no canal

        canal.send("Obrigado por me adicionar! Utilize o `"+ prefix +"h` para ver minha lista de comandos, você também pode alterar meu prefixo com o `"+ prefix +"px <prefixo>` ou meu idioma com o `"+ prefix +"lang en`!\n\nThanks for adding me! Use `"+ prefix +"h` to see my command list, you can also change my prefix with `"+ prefix +"px <prefix>` or my language with `"+ prefix +"lang pt`!");
    }
}