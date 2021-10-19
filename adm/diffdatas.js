module.exports = (date1, date2, utilitarios) => {

    let second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24,
    week = day * 7;
    dateone = new Date(date1).getTime();
    datetwo = (date2) ? new Date().getTime() : new Date(date2).getTime();
    let timediff = datetwo - dateone;
    
    secdate = new Date(date2);
    firdate = new Date(date1);
    
    if (isNaN(timediff)) return 0;
    
    let diferencas = [];

    diferencas.push(secdate.getFullYear() - firdate.getFullYear());
    diferencas.push(((secdate.getFullYear() * 12 + secdate.getMonth()) - (firdate.getFullYear() * 12 + firdate.getMonth())));
    diferencas.push(Math.floor(timediff / week));
    diferencas.push(Math.floor(timediff / day));
    diferencas.push(Math.floor(timediff / hour));
    diferencas.push(Math.floor(timediff / minute));
    diferencas.push(Math.floor(timediff / second));

    let retorno_ajustado = "";

    if(diferencas[0] > 1)
        retorno_ajustado = diferencas[0] +""+ utilitarios[14]["anos"];
    else if(diferencas[0] > 0)
        retorno_ajustado = "1"+ utilitarios[14]["ano"];

    if(diferencas[1] % 12 > 1)
        retorno_ajustado += diferencas[1] % 12 +""+ utilitarios[14]["meses"];
    else if(diferencas[1] % 12 > 0)
        retorno_ajustado += diferencas[1] % 12 +""+ utilitarios[14]["mes"];

    if(diferencas[3] % 30 > 1)
        retorno_ajustado += diferencas[3] % 30 +""+ utilitarios[14]["dias"];
    else if(diferencas[3] % 30 > 0)
        retorno_ajustado += diferencas[3] % 30 +""+ utilitarios[14]["dia"];

    if(diferencas[4] % 24 > 1 && diferencas[1] < 30)
        retorno_ajustado += diferencas[4] % 24 +""+ utilitarios[14]["horas"];
    else if(diferencas[4] % 24 > 0 && diferencas[1] < 30)
        retorno_ajustado += diferencas[4] % 24 +""+ utilitarios[14]["hora"];

    if(diferencas[5] % 60 > 1 && diferencas[1] == 0)
        retorno_ajustado += diferencas[5] % 60 +""+ utilitarios[14]["minutos"];
    else if(diferencas[5] % 60 > 0 && diferencas[1] == 0)
        retorno_ajustado += diferencas[5] % 60 +""+ utilitarios[14]["minuto"];

    if(diferencas[6] % 60 > 1 && diferencas[4] < 24)
        retorno_ajustado += utilitarios[14]["e"] +""+ diferencas[6] % 60 +""+ utilitarios[14]["segundos"];
    else if(diferencas[6] % 60 > 0 && diferencas[4] < 24)
        retorno_ajustado += utilitarios[14]["e"] +""+ diferencas[6] % 60 +""+ utilitarios[14]["segundo"];

    return retorno_ajustado;
}