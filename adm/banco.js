const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('banco.json');
const db = low(adapter);

db.set('servidor1', []).write();