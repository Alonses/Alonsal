module.exports = {
    name: "prefixo",
    description: "prefix",
    aliases: [ "prf" ],
    usage: "prf !",
    cooldown: 5,
    permissions: [ "ADMINISTRATOR" ],
    async execute(client, message, args) {

        const sqlite = require("sqlite3").verbose();
        let db = new sqlite.Database('./adm/base_dados.db', sqlite.OPEN_READWRITE);

        prefix = args[0];
        message.channel.send(`${message.author}`+' o novo prefixo deste servidor é `'+ prefix +'`');

        guild = message.guild;

        let query = `SELECT * FROM servers WHERE id_server = ?`;
        db.get(query, [guild.id], (err, row) => {
            if(err){
                console.log(err);
                return;
            }
            
            if(row !== undefined){
                let ID = message.guild.id;

                let inserirDados = db.prepare(`UPDATE servers set prefix = ? WHERE id_server = ?`);
                inserirDados.run(args[0], ID); // Insere no banco  
                inserirDados.finalize();
            }
        });
        
        db.close();    
        return;
    }
};