const sqlite = require("sqlite3").verbose();

module.exports = async ({client, message, content, guild}) => {

    if(message.author.id == 852589532993683467){
        let db = new sqlite.Database('./adm/base_dados.db', sqlite.OPEN_READWRITE);
        db.run(`CREATE TABLE IF NOT EXISTS servers (id_server INTEGER NOT NULL, name_server TEXT, prefix TEXT, PRIMARY KEY(id_server))`);

        if(message.content === ".aget"){
            let query = `SELECT * FROM servers WHERE id_server = ?`;
            db.get(query, [guild.id], (err, row) => {
                if(err){
                    console.log(err);
                    return;
                }
                
                if(row === undefined){ // Inserindo um novo servidor
                    let ID = guild.id;
                    let name = guild.name;

                    let inserirDados = db.prepare(`INSERT INTO servers (id_server, name_server, prefix) VALUES (?,?,?)`);
                    inserirDados.run(ID, name, ".a"); // Insere no banco
                    inserirDados.finalize();

                    db.close();
                    return;
                }
            });
        }

        if(message.content == ".adel"){
            let query = `SELECT * FROM servers WHERE id_server = ?`;
            db.get(query, [guild.id], (err, row) => {
                if(err){
                    console.log(err);
                    return;
                }
                
                if(row !== undefined){
                    let ID = guild.id;

                    let inserirDados = db.prepare(`DELETE FROM servers WHERE id_server = ?`);
                    inserirDados.run(ID); // Insere no banco
                    inserirDados.finalize();
                }
            });

            db.close();
            return;
        }
    }
}