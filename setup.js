require('dotenv').config()

// ---------------------------------------------------------------
// Switches between normal and development mode
const update_commands = 0 // Forces the update of slash commands globally
let modo_develop = 0
let silent = 0
const limited = 0
const debug_mode = 0
const delete_slash = 0 // Clear the local and global slash commands

// Update the commands of the main bot
if (update_commands) {
    modo_develop = 0
    silent = 1
}

// Validating if the requested environment variables exist and returning a default value if they don't
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
    debug_mode,
    delete_slash,
    force_update: update_commands,
    status: (silent || modo_develop) ? 0 : 1,
    logger: (silent || modo_develop) ? 0 : 1,
    ranking: (limited || silent || modo_develop) ? 0 : 1,
    modules: !modo_develop,
    relatorio: (update_commands || silent || modo_develop) ? 0 : 1,
    voice_channels: !modo_develop,
    guild_timeout: 0,

    id: modo_develop ? getEnvVar('client_2') : getEnvVar('client_1'),
    token: modo_develop ? getEnvVar('token_2') : getEnvVar('token_1'),
    owners: getEnvVar('owner_id').split(',').map(o => o.trim()).filter(Boolean),
    id_enceirados: getEnvVar('ids_enceirados').split(',').map(e => e.trim()).filter(Boolean),
    guild_emojis: getEnvVar('guild_emojis').split(',').map(g => g.trim()).filter(Boolean)
}

module.exports.client_data = client_data