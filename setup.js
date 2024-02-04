require('dotenv').config()

/* --------------------------------------------------------------- */
// Alterna entre o modo normal e modo de testes
const update_commands = 0
let modo_develop = 0, silent = 0

// Ative para limpar os comandos slash locais e globais
let delete_slash = 0

if (update_commands) // Force update é utilizado para forçar a atualização dos comandos slash
    modo_develop = 0, silent = 1

const client_data = {
    debug_mode: false,
    anuncio_diario: 0,
    modo_develop: modo_develop,
    delete_slash: delete_slash,
    force_update: update_commands ? 1 : 0,
    status: silent || modo_develop ? 0 : 1,
    logger: silent || modo_develop ? 0 : 1,
    ranking: silent || modo_develop ? 0 : 1,
    modules: update_commands || silent || modo_develop ? 0 : 1,
    relatorio: update_commands || silent || modo_develop ? 0 : 1,

    id: modo_develop ? process.env.client_2 : process.env.client_1,
    token: modo_develop ? process.env.token_2 : process.env.token_1,
}

module.exports.client_data = client_data