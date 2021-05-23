const { post } = require('request');
let tumblr = require('tumblr.js');

function redesSociaisDAO(connection){
    this._connection = connection
}

redesSociaisDAO.prototype.status = function(req, res){

    let client = this._authTumblr(req.session)

    client.userInfo(function (err, data) {
        if(err) res.render('dashboards/midiasSociais/midias' , {statusTumblr:"disconnected"});
        else if(data){
            //console.log(data);
            res.render('dashboards/midiasSociais/midias' , {statusTumblr:"connected"})
        };
    });
    
}

redesSociaisDAO.prototype.pegarPosts = function(req, res, msg=""){
    
    let client = this._authTumblr(req.session)
    
    client.blogPosts("testeigor", function(err, data){
        let posts = Array()
        
        if(err) console.log('Não conectado com tumblr')
        else posts = data.posts

        posts.map(function(value, index){
 
            let data = new Date(value.date)
            posts[index].date = data.getDate() + '/' + (data.getMonth() + 1)+'/' + data.getFullYear()
            posts[index].time = data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds()

        })
        
        res.render('dashboards/panel', {dados: posts, msg: msg})
    })
}

redesSociaisDAO.prototype.editPost = function(req, res, dados){
    
    let client = this._authTumblr(req.session)
    
    client.editPost("testeigor", dados, function(err, data){

        if(err) throw err
    })

    return true
}

redesSociaisDAO.prototype.deletePost = function(req, res, id){
    
    let client = this._authTumblr(req.session)
    
    client.deletePost("testeigor", id, function(err){

        if(err) throw err
        //else res.redirect('/B')

        //res.render('dashboards/panel', {dados: posts})
    })

    return true
}

redesSociaisDAO.prototype.getSpecPost = function(req, res, id){
    
    let client = this._authTumblr(req.session)

    
    client.blogPosts("testeigor", id, function(err, data){
        //let posts = Array()

        if(err) throw err
        else if(data){
            let posts = data.posts
            //console.log(posts);
            res.render('dashboards/register', {dados: posts, msg: ""})
        }
    })
    
}

redesSociaisDAO.prototype.createPost = function(req, res, dados){
    
    let client = this._authTumblr(req.session)

    client.createTextPost("testeigor", dados, function(err){  
        if(err) console.log(err)
        //else res.redirect('dashboards/panel/A')
    })

    return true
}

redesSociaisDAO.prototype.createPostAgendada = function(req, res, dados){
    
    let client = this._authTumblr(req.session)

    client.createTextPost("testeigor", dados, function(err){  
        if(err) console.log(err)
    })

}

redesSociaisDAO.prototype.pegarPostsFilter = function(filter, req, res){
    
    let client = this._authTumblr(req.session)
    let date = new Date()

    /* PROBLEMAS COM O FILTRO */

    if(filter == 'mespassado'){
        date.setMonth(date.getMonth() - 1)
    }
    
    let dateStart = new Date(date)
    let dateFinal = new Date(date)
    
    dateStart.setDate(1)
    dateFinal.setDate(31)
    //console.log(dateStart);
    //console.log(dateFinal);

    client.blogPosts("testeigor", function(err, data){
        let posts = Array()
        let postsFilter = Array()
        
        //if(err) throw err
        if(data.posts) posts = data.posts
        else res.end()

        posts.map(function(value, index){
            
            let data = new Date(value.date)
            posts[index].date = data.getDate() + '/' + (data.getMonth() + 1) +'/' + data.getFullYear()
            posts[index].time = data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds()

            
            if(value.date >= dateStart && value.date <= dateFinal){
                postsFilter.push(posts[index])
            }
        })

        if(postsFilter.length == 0) res.end()
        postsFilter = JSON.stringify(postsFilter);
        res.end(postsFilter)
    })
}

redesSociaisDAO.prototype.deslogarTumblr = function(req, res){

    let query = "UPDATE midia_tumblr SET status = false, login = '', senha = '' WHERE id_user = ?"
    this._connection.query(query, [req.session.usuarioID], (error) => {
        
        if(error) throw error
        else{
            res.render('dashboards/redesSociais', {msg:"A"})
        }
    })
}

redesSociaisDAO.prototype.conectarTumblr = function(dados, req, res){
    
    let client = this._authTumblr(dados);
    if(!client) throw err
    else{
        this._connection.query("UPDATE midia_tumblr SET ? WHERE id_user = ?", [dados, req.session.usuarioID], (error, result) => {        
            if(error) throw error
            else res.render('accounts/login', {msg:"D"})
        })
    }
    
}

redesSociaisDAO.prototype._authTumblr = function(dados){
    // Authenticate via OAuth
    let client = tumblr.createClient({
    consumer_key: dados.consumer_key,
    consumer_secret: dados.consumer_secret,
    token: dados.token,
    token_secret: dados.token_secret
    });

    return client;
}


module.exports = () => redesSociaisDAO