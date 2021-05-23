let crypto = require('crypto')

function usuariosDAO(connection){
    this._connection = connection
    this.criarBasedeDados()
}

usuariosDAO.prototype.logarUser = function(usuario, req, res){

    usuario.senha = crypto.createHash("md5").update(usuario.senha).digest("hex")

    let query = "SELECT * FROM users INNER JOIN midia_tumblr on users.id_user = midia_tumblr.id_user WHERE email = ? AND senha = ? LIMIT 1;"
    
    this._connection.query(query, [usuario.email, usuario.senha], function(error, results){
        
        if(error){
            throw error 
        }
        
        if(results[0] != undefined){
            req.session.autorizado = true
            req.session.usuarioID = results[0].id_user
            req.session.nome = results[0].nome
            
            // AuthTumblr Credencials
            req.session.status = results[0].status
            req.session.consumer_key = results[0].consumer_key
            req.session.consumer_secret = results[0].consumer_secret
            req.session.token = results[0].token
            req.session.token_secret = results[0].token_secret
            
        }
        //console.log(req.session.usuarioID)
        req.session.autorizado ? res.redirect('dashboards/panel') : res.render('accounts/login', {msg:"A"})
    })
}

usuariosDAO.prototype.cadastrarUser = function(usuario, req, res){

    usuario.senha = crypto.createHash("md5").update(usuario.senha).digest("hex")
    
    this._connection.query("INSERT INTO users SET ?", [usuario], (error) => {
        
        if(error) throw error
        else{
            console.log('Usuario Cadastrado com Sucesso');
            this.inserirMidia(usuario, req, res)
        }
    })   
}

usuariosDAO.prototype.inserirMidia = function(usuario, req, res){

    this._connection.query("SELECT id_user FROM users WHERE email = ? AND senha = ?", [usuario.email, usuario.senha], (error, result) => {
        
        if(error) throw error
        else{
            this._connection.query("INSERT INTO midia_tumblr SET id_user = ?", [result[0].id_user], (err) => {
        
                if(err) throw err
                else{
                    console.log('Midia inserida com sucesso');
                    res.render('accounts/login', {msg:"B"})
                }
            }) 
        }
    })
}

usuariosDAO.prototype.criarBasedeDados = function(){

    let sql = 'CREATE DATABASE IF NOT EXISTS socialmedia_system'
    
    this._connection.query(sql, (error) => {
        if(error) throw error
    })

    this.criarTabelas()
}

usuariosDAO.prototype.criarTabelas = function(){

    let sql_users = "CREATE TABLE IF NOT EXISTS users (id_user int NOT NULL AUTO_INCREMENT, nome varchar(30) NOT NULL, email varchar(50) NOT NULL, senha varchar(32) NOT NULL, PRIMARY KEY (id_user))"
    let sql_midiaTumblr = "CREATE TABLE IF NOT EXISTS midia_tumblr (id_user int NOT NULL, status boolean default false, consumer_key varchar (50), consumer_secret varchar (50), token varchar (50), token_secret varchar (50), FOREIGN KEY (id_user) REFERENCES users(id_user))"
    let sql_publications = "CREATE TABLE IF NOT EXISTS publications (id_pub int NOT NULL AUTO_INCREMENT, id_user int NOT NULL, titulo varchar(30) NOT NULL, body MEDIUMTEXT, data date, hora time, FOREIGN KEY (id_user) REFERENCES users(id_user), PRIMARY KEY (id_pub))"
    
    this._connection.query(sql_users, (error) => {
        if(error) throw error
    })

    this._connection.query(sql_midiaTumblr, (error) => {
        if(error) throw error
    })
 
    this._connection.query(sql_publications, (error) => {
        if(error) throw error
    })
    
}

module.exports = () => usuariosDAO