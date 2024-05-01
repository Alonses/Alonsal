const { badges } = require("../../data/user_badges")

const { verifyDynamicBadge } = require("../../database/schemas/User_badges")

module.exports = async (client) => {

    // Checking which user has the most Bufunfas
    verifyDynamicBadge(client, "bufunfas", badges.BOURGEOIS)

    // Searching for the highest ranking user and granting a special badge
    verifyDynamicBadge(client, "ranking", badges.CHATTERBOX)
}