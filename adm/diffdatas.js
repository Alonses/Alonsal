module.exports = (date1, date2, utilitarios) => {

    const now = new Date(date1); // Data de hoje
    const past = new Date(date2); // Outra data no passado
    const timediff = Math.abs(now.getTime() - past.getTime()); // Subtrai uma data pela outra
 
    let diferencas = [];

    diferencas.push(Math.floor(timediff / (1000 * 60 * 60 * 24 * 30 * 12))); // Ano 0
    diferencas.push(Math.floor(timediff / (1000 * 60 * 60 * 24 * 30) % 12)); // Mes 1
    diferencas.push(Math.floor(timediff / 1000 / 60 / (60 * 24))); // Dia 2
    diferencas.push(Math.floor(timediff / (1000 * 60 * 60) % 24)); // Hora 3
    diferencas.push(Math.floor(timediff / (1000 * 60) % 60)); // Minuto 4
    diferencas.push(Math.floor((timediff / 1000) % 60)); // Segundo 5

    let retorno_ajustado = "";

    diferencas[2] = diferencas[2] % 30;

    if(diferencas[0] > 1)
        retorno_ajustado = diferencas[0] +""+ utilitarios[14]["anos"];
    else if(diferencas[0] > 0)
        retorno_ajustado = "1"+ utilitarios[14]["ano"];

    if(diferencas[1] > 1)
        retorno_ajustado += diferencas[1] +""+ utilitarios[14]["meses"];
    else if(diferencas[1] > 0)
        retorno_ajustado += diferencas[1] +""+ utilitarios[14]["mes"];

    if(diferencas[2] > 1)
        retorno_ajustado += diferencas[2] +""+ utilitarios[14]["dias"];
    else if(diferencas[2] > 0)
        retorno_ajustado += diferencas[2] +""+ utilitarios[14]["dia"];

    if(diferencas[3] > 1 && diferencas[0] < 1)
        retorno_ajustado += diferencas[3] +""+ utilitarios[14]["horas"];
    else if(diferencas[3] > 0 && diferencas[0] < 1)
        retorno_ajustado += diferencas[3] +""+ utilitarios[14]["hora"];

    if(diferencas[4] > 1 && diferencas[1] == 0)
        retorno_ajustado += diferencas[4] +""+ utilitarios[14]["minutos"];
    else if(diferencas[4] > 0 && diferencas[1] == 0)
        retorno_ajustado += diferencas[4] +""+ utilitarios[14]["minuto"];

    if(diferencas[5] > 1 && diferencas[3] < 24 && diferencas[2] < 1)
        retorno_ajustado += utilitarios[14]["e"] +""+ diferencas[5] +""+ utilitarios[14]["segundos"];
    else if(diferencas[5] > 0 && diferencas[3] < 24 && diferencas[2] < 1)
        retorno_ajustado += utilitarios[14]["e"] +""+ diferencas[5] +""+ utilitarios[14]["segundo"];

    return retorno_ajustado;
}