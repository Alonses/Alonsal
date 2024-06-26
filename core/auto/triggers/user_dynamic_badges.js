const { verifyDynamicBadge } = require("../../database/schemas/User_badges")

const { badges } = require("../../formatters/patterns/user")

module.exports = async (client) => {

    // Checking which user has the most Bufunfas
    verifyDynamicBadge(client, "bufunfas", badges.BOURGEOIS)

    // Searching for the highest ranking user and granting a special badge
    verifyDynamicBadge(client, "ranking", badges.CHATTERBOX)
}