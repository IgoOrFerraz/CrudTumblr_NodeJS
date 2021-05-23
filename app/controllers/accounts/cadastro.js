module.exports.cadastrar = function(application, req, res){
    
    let dadosForm = req.body
    
    let connection = new application.config.dbConnection()
    let usuariosDAO = new application.app.models.usuariosDAO(connection)

    usuariosDAO.cadastrarUser(dadosForm, req, res)
}