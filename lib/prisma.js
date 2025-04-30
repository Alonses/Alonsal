const { PrismaClient } = require('../generated/prisma/client');

let prisma;

if (global.__prisma) {
    prisma = global.__prisma;
} else {
    prisma = new PrismaClient();
    global.__prisma = prisma;
}

module.exports.prisma = prisma;