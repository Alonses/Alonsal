require('dotenv').config()

/* --------------------------------------------------------------- */
// Alterna entre o modo normal e modo de testes
const update_commands = 0
let modo_develop = 0, status = 1, ranking = 1, force_update = 0, silent = 0, modules = 1, relatorio = 1, logger = 1

// Ative para limpar os comandos slash locais e globais
let delete_slash = 0

if (update_commands) // Force update é utilizado para forçar a atualização dos comandos slash
    modo_develop = 0, force_update = 1, silent = 1, modules = 0, relatorio = 0

if (silent || modo_develop)
    status = 0, ranking = 0, modules = 0, relatorio = 0, logger = 0

const client_data = {
    status: status,
    logger: logger,
    modules: modules,
    ranking: ranking,
    relatorio: relatorio,
    modo_develop: modo_develop,
    force_update: force_update,
    delete_slash: delete_slash,

    id: modo_develop ? process.env.client_2 : process.env.client_1,
    token: modo_develop ? process.env.token_2 : process.env.token_1,
}

module.exports.client_data = client_data