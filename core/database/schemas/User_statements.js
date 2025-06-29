const mongoose = require("mongoose")

// uid -> User ID

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    operation: { type: String, default: null },
    type: { type: Boolean, default: false }, // false -> saída, true -> entrada
    value: { type: Number, default: 0 },
    timestamp: { type: Number, default: null }
})

const model = mongoose.model("User_statements", schema)

async function registryStatement(client, uid, operation, type, value) {

    const statements = await getUserStatements(uid)
    if (statements.length > 9) //  Exclui a última movimentação após 10 novas entradas
        dropUserStatement(uid, statements[9].timestamp)

    await model.create({
        uid: uid,
        operation: operation,
        type: type,
        value: value,
        timestamp: client.timestamp()
    })
}

async function getUserStatements(uid) {
    return model.find({
        uid: uid
    }).sort({
        timestamp: -1
    })
}

async function encryptUserStatements(uid, new_user_id) {

    await model.updateMany(
        { uid: uid },
        {
            $set: {
                uid: new_user_id
            }
        }
    )
}

async function dropUserStatement(uid, timestamp) {
    await model.findOneAndDelete({
        uid: uid,
        timestamp: timestamp
    })
}

async function dropAllUserStatements(uid) {
    await model.deleteMany({
        uid: uid
    })
}

module.exports.User_statements = model
module.exports = {
    registryStatement,
    getUserStatements,
    dropUserStatement,
    dropAllUserStatements,
    encryptUserStatements
}