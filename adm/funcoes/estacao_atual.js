module.exports = (latitude, idioma_adotado) => {

    if(idioma_adotado == "al-br") idioma_adotado = "pt-br";
    const { utilitarios } = require(`../../arquivos/idiomas/${idioma_adotado}.json`);
    
    let data_atual = new Date('12/22/2022');
    
    const emojis = ["🌻", "🍂", "❄️", "🌼"];
    let datas_estacao = ["21/12", "21/03", "21/06", "21/09"];
    const estacao_nome = ["verao", "outono", "inverno", "primavera"];

    let dias_passados = diferencia_dias(calcula_dias(`01/01/${data_atual.getFullYear()}`), calcula_dias(`${data_atual.getMonth() + 1}/${data_atual.getDate()}/${data_atual.getFullYear()}`));    

    // Estipulando um indice de clima
    let indice = estipula_indice(dias_passados, latitude);
    if(latitude > 0) // Hemisfério norte
        datas_estacao = ["21/06", "21/09", "21/12", "21/03"];
    
    let indice_int = indice + 1;
    if(indice_int >= datas_estacao.length) indice_int = 0;

    comeco_termino = `${utilitarios[8]["comeco"]} ${datas_estacao[indice]}${utilitarios[8]["termino"]} ${datas_estacao[indice_int]}`;

    // Calculando o tempo restante em dias para o fim da estação
    mes_termino = parseInt(datas_estacao[indice_int].split("/")[1]);

    if(dias_passados <= 354)
        dias_restantes = diferencia_dias(calcula_dias(`${data_atual.getMonth() + 1}/${data_atual.getDate()}/${data_atual.getFullYear()}`), calcula_dias(`0${mes_termino}/21/${data_atual.getFullYear()}`));
    else // Ano seguinte
        dias_restantes = diferencia_dias(calcula_dias(`${data_atual.getMonth() + 1}/${data_atual.getDate()}/${data_atual.getFullYear()}`), calcula_dias(`0${mes_termino}/21/${data_atual.getFullYear() + 1}`));

    if(dias_restantes > 0){
        if(dias_restantes > 1) dias_restantes += `${utilitarios[14]["dias"]}`;
        else dias_restantes += `${utilitarios[14]["dia"]}`;
        
        termino = `${utilitarios[8]["termino"]} ${dias_restantes}`;
    }else
        termino = utilitarios[8]["termino_hoje"];
    
    return `${emojis[indice]} ${utilitarios[8][estacao_nome[indice]]}${termino}\n${comeco_termino}`;
}

function calcula_dias(data_alvo){

    let data = new Date(data_alvo);

    return data.getTime();
}

function diferencia_dias(data_anterior, data_futura){

    let diferenca = data_futura - data_anterior;

    return diferenca / ( 1000 * 3600 * 24);
}

function estipula_indice(dias_passados, latitude){

    // Estipula um indice para a estação do local
    let indices = [1, 2, 3, 0];

    if(latitude > 0) // Hemisfério norte
        indices = [3, 0, 1, 2];

    let indice = dias_passados > 79 && dias_passados <= 171 ? indices[0] : dias_passados > 171 && dias_passados <= 264 ? indices[1] : dias_passados > 264 && dias_passados <= 354 ? indices[2] : indices[3];

    return indice;
}