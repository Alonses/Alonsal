require('dotenv').config()

// ---------------------------------------------------------------
// Alterna entre modo normal e modo de testes
const update_commands = 0 // Força atualização dos comandos slash
let modo_develop = 0
let silent = 0
const limited = 0
const delete_slash = 0 // Limpa comandos slash locais e globais

// Atualizando os comandos do bot principal
if (update_commands) {
    modo_develop = 0
    silent = 1
}

// Validando se as variáveis de ambiente solicitadas existem e retornando um valor padrão se não existirem
function getEnvVar(name) {
    if (!process.env[name]) {
        console.warn(`🛑 | Variável de ambiente '${name}' não definida. Não é possível iniciar sem esse valor informado.`)
        process.exit(1)
    }

    return process.env[name]
}

const client_data = {
    sharding: 0,
    debug_mode: 0,
    daily_announce: 0,
    modo_develop,
    delete_slash,
    force_update: update_commands,
    status: (silent || modo_develop) ? 0 : 1,
    logger: (silent || modo_develop) ? 0 : 1,
    ranking: (limited || silent || modo_develop) ? 0 : 1,
    modules: !modo_develop,
    relatorio: (update_commands || silent || modo_develop) ? 0 : 1,
    voice_channels: !modo_develop,
    guild_timeout: 0,

    owners: getEnvVar('owner_id').split(',').map(o => o.trim()).filter(Boolean),
    id: modo_develop ? getEnvVar('client_2') : getEnvVar('client_1'),
    token: modo_develop ? getEnvVar('token_2') : getEnvVar('token_1'),
}

module.exports.client_data = client_data