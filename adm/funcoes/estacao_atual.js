module.exports = (latitude, idioma_adotado) => {

    if(idioma_adotado == "al-br") idioma_adotado = "pt-br";

    const { utilitarios } = require(`../../arquivos/idiomas/${idioma_adotado}.json`);

    let indice = 0;
    const data_atual = new Date();
    const emojis = ["🌻", "🍂", "❄️", "🌼"];
    let datas_estacao = ["21/12", "21/03", "21/06", "21/09"];
    const estacao_nome = ["verao", "outono", "inverno", "primavera"];

    const dias_passados = calcula_dias(data_atual.getDate(), data_atual.getMonth() + 1, data_atual.getFullYear());

    if(latitude < 0) // Hemisfério sul
        indice = dias_passados > 79 && dias_passados < 171 ? 1 : dias_passados >= 171 && dias_passados < 264 ? 2 : dias_passados >= 264 && dias_passados < 354 ? 3 : 0;
    else{ // Hemisfério norte
        indice = dias_passados > 79 && dias_passados < 171 ? 3 : dias_passados >= 171 && dias_passados < 264 ? 0 : dias_passados >= 264 && dias_passados < 354 ? 1 : 2;
        datas_estacao = ["21/06", "21/09", "21/12", "21/03"];
    }

    let indice_int = indice + 1;
    if(indice_int >= datas_estacao.length) indice_int = 0;

    comeco_termino = `${utilitarios[8]["comeco"]} ${datas_estacao[indice]}${utilitarios[8]["termino"]} ${datas_estacao[indice_int]}`;

    // Calculando o tempo restante em dias para o fim da estação
    mes_termino = parseInt(datas_estacao[indice_int].split("/")[1]);
    dias_restantes = calcula_dias(21, mes_termino, data_atual.getFullYear()) - calcula_dias(data_atual.getDate(), data_atual.getMonth() + 1, data_atual.getFullYear());
    
    if(dias_restantes > 1) dias_restantes += `${utilitarios[14]["dias"]}`;
    else dias_restantes += `${utilitarios[14]["dia"]}`;

    estacao = `${emojis[indice]} ${utilitarios[8][estacao_nome[indice]]}${utilitarios[8]["termino"]} ${dias_restantes}\n${comeco_termino}`;

    return estacao;
}

function calcula_dias(dia_atual, mes_atual, ano_atual){

    let dias = 0;
    let ult_mes = 0;

    for (let x = 0; x <= mes_atual; x++) {
        let diasNoMes = new Date(ano_atual, x + 1, 0).getDate();

        for (let i = 1; i <= diasNoMes; i++) {
            dias++
        }

        ult_mes = diasNoMes;
    }

    return (dias - (ult_mes - dia_atual));
}