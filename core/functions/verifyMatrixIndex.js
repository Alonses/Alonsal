module.exports = ({ data }) => {

    // Retorna o indice em que a configuração de uma advertência ou strike resultará em expulsão ou banimento
    const guild_config = data.guild_config
    let indice_matriz

    guild_config.forEach(config => {
        if ((config.action === "member_kick_2" || config.action === "member_ban") && !indice_matriz)
            indice_matriz = config.rank + 1
    })

    return indice_matriz || guild_config.length
}