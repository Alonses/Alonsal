const defaultEraser = {
    1: 172800,  // 2 dias
    2: 345600,  // 4 dias
    3: 432000,  // 5 dias
    4: 604800,  // 7 dias
    5: 1209600, // 14 dias
    6: 1814400, // 21 dias
    7: 2419200  // 28 dias
}

const banMessageEraser = {
    0: 0,      // Sem tempo
    1: 3600,   // 1 hora
    2: 7200,   // 2 horas
    3: 21700,  // 6 horas
    4: 43200,  // 12 horas
    5: 86400,  // 1 dia
    6: 172800, // 2 dias
    7: 259200, // 3 dias
    8: 432000, // 5 dias
    9: 604800  // 7 dias
}

const defaultRoleTimes = {
    1: 3600,   // 1 hora
    2: 7200,   // 2 horas
    3: 21700,  // 6 horas
    4: 43200,  // 12 horas
    5: 86400,  // 1 dia
    6: 172800,  // 2 dias
    7: 345600,  // 4 dias
    8: 432000,  // 5 dias
    9: 604800,  // 7 dias
    10: 1209600, // 14 dias
    11: 1814400, // 21 dias
    12: 2419200,  // 1 mês
    13: 7257600,  // 3 meses
    14: 14515200, // 6 meses
    15: 29030400  // 1 ano
}

const spamTimeoutMap = {
    1: 3600,   // 1 hora
    2: 7200,   // 2 horas
    3: 21700,  // 6 horas
    4: 43200,  // 12 horas
    5: 86400,  // 1 dia
    6: 172800, // 2 dias
    7: 259200, // 3 dias
    8: 432000, // 5 dias
    9: 604800,  // 7 dias
    10: 1209600, // 14 dias
    11: 1814400, // 21 dias
    12: 2419200  // 28 dias
}

const defaultStrikes = {
    1: 7200,   // 2 horas
    2: 21700,  // 6 horas
    3: 172800, // 2 dias
    4: 604800  // 7 dias
}

const defaultUserEraser = {
    1: 2419200,   // 1 mês
    2: 7257600,   // 3 meses
    3: 14515200,  // 6 meses
    4: 29030400,  // 1 ano
    5: 58060800,  // 2 anos
    6: 87091200   // 3 anos
}

const defaultWarnStrikes = [3, 4, 5, 6, 7]

module.exports = {
    defaultEraser,
    banMessageEraser,
    defaultRoleTimes,
    spamTimeoutMap,
    defaultStrikes,
    defaultUserEraser,
    defaultWarnStrikes
}