module.exports.logar = function(application, req, res){
    
    let dadosForm = req.body

    let connection = new application.config.dbConnection()
    let usuariosDAO = new application.app.models.usuariosDAO(connection)
    
    usuariosDAO.logarUser(dadosForm, req, res)
}

module.exports.deslogar = function(application, req, res){
	req.session.destroy(function(error){
		res.redirect('/')
	})
}
