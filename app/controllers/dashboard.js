module.exports.panel = function(application, req, res){

    if(!req.session.autorizado){
        res.render('accounts/login', {msg:"C"})
        return
    }

    let connection = new application.config.dbConnection()
    let redesSociaisDAO = new application.app.models.redesSociaisDAO(connection)

    redesSociaisDAO.pegarPosts(req, res)
}

module.exports.panelControl = function(application, req, res){

    if(!req.session.autorizado){
        res.render('accounts/login', {msg:"C"})
        return
    }

    let connection = new application.config.dbConnection()
    let publicacoesDAO = new application.app.models.publicacoesDAO(connection)

    publicacoesDAO.pegarPublicAgendadas(req, res)
}

module.exports.filter = function(application, req, res){
    
    let filter = req.body.filter

    let connection = new application.config.dbConnection()
    let redesSociaisDAO = new application.app.models.redesSociaisDAO(connection)

    redesSociaisDAO.pegarPostsFilter(filter, req, res)
}

module.exports.TumblrStatus = function(application, req, res){
    
    let connection = new application.config.dbConnection()
    let redesSociaisDAO = new application.app.models.redesSociaisDAO(connection)

    redesSociaisDAO.status(req, res)
}

module.exports.deslogarTumblr = function(application, req, res){

    let connection = new application.config.dbConnection()
    let redesSociaisDAO = new application.app.models.redesSociaisDAO(connection)

    redesSociaisDAO.deslogarTumblr(req, res)
}

module.exports.conectarTumblr = function(application, req, res){

    let dadosForm = req.body
    
    let connection = new application.config.dbConnection()
    let redesSociaisDAO = new application.app.models.redesSociaisDAO(connection)
    
    //res.send(connection)

    redesSociaisDAO.conectarTumblr(dadosForm, req, res)
}

module.exports.register = function(application, req, res){

    let id = req.params
    //res.send(dadosForm)
    
    let connection = new application.config.dbConnection()
    let redesSociaisDAO = new application.app.models.redesSociaisDAO(connection)
    
    redesSociaisDAO.getSpecPost(req, res, id)
}

module.exports.deleteRegister = function(application, req, res){

    let id = req.params
    
    let connection = new application.config.dbConnection()
    let redesSociaisDAO = new application.app.models.redesSociaisDAO(connection)
    
    if(redesSociaisDAO.deletePost(req, res, id)){
        setTimeout(function(){
            redesSociaisDAO.pegarPosts(req, res, "B")
        }, 2000)
    }
}

module.exports.registerEdit = function(application, req, res){

    let dadosForm = req.body
    //res.send(dadosForm)
    
    let connection = new application.config.dbConnection()
    let redesSociaisDAO = new application.app.models.redesSociaisDAO(connection)
    
    if(redesSociaisDAO.editPost(req, res, dadosForm)){
        setTimeout(function(){
            redesSociaisDAO.pegarPosts(req, res, "C")
        }, 2000)
    }
}

module.exports.createPost = function(application, req, res){

    let dadosForm = req.body
    
    let connection = new application.config.dbConnection()
    let redesSociaisDAO = new application.app.models.redesSociaisDAO(connection)
    let publicacoesDAO = new application.app.models.publicacoesDAO(connection)
    
    /* CASO DATA E HORA NÃO FOREM PREENCHIDOS NA HORA DE EFETUAR A PUBLICAÇÃO, EXECUTAR A PUBLICACAO IMEDIATA */
    /* CASO CONTRARIO INTERMEDIAR A OPERAÇÃO E ENVIAR PARA O MYSQL SOCIALMEDIA_SYSTEM.PUBLICATIONS */
    if(dadosForm.date == '' && dadosForm.time == ''){

        if(redesSociaisDAO.createPost(req, res, dadosForm)){
            setTimeout(function(){
                redesSociaisDAO.pegarPosts(req, res, "A")
            }, 2000)
        }

    } else{
        if(publicacoesDAO.inserirPublicacao(dadosForm, req, res)){
            setTimeout(function(){
                redesSociaisDAO.pegarPosts(req, res, "A")
            }, 2000)
        }
    }
}

module.exports.panelControlRegister = function(application, req, res){

    let id = req.body.data

    let connection = new application.config.dbConnection()
    //let redesSociaisDAO = new application.app.models.redesSociaisDAO(connection)
    let publicacoesDAO = new application.app.models.publicacoesDAO(connection)
   
    publicacoesDAO.pegarPublic(id, req, res)
}

module.exports.panelControlRegisterPublic = function(application, req, res){

    let data = JSON.parse(req.body.data)
    let ids = {id_pub: data.id_pub, id_user: data.id_user}
    let dados = {title: data.titulo, body: data.body}

    let connection = new application.config.dbConnection()
    let redesSociaisDAO = new application.app.models.redesSociaisDAO(connection)
    let publicacoesDAO = new application.app.models.publicacoesDAO(connection)
   
    redesSociaisDAO.createPostAgendada(req, res, dados)
    publicacoesDAO.deletarPubAgor(req, res, ids)

    res.end()
}