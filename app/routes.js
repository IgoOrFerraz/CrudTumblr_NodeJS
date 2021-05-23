module.exports = function(application){

    /* Accounts */

	application.get('/', function(req, res){
		res.render('accounts/login', {msg:{}})
	});
    
    application.get('/cadastro', function(req, res){
        res.render('accounts/cadastro')
	});

    application.post('/logar', function(req, res){
        application.app.controllers.accounts.login.logar(application, req, res)
	});

    application.post('/cadastro/cadastrar', function(req, res){
        application.app.controllers.accounts.cadastro.cadastrar(application, req, res)
	});

    application.get('/deslogar', function(req, res){
        application.app.controllers.accounts.login.deslogar(application, req, res)
	});

    /* DashBoard */

    application.get('/dashboards/panel', function(req, res){
        application.app.controllers.dashboard.panel(application, req, res)
	});

    application.get('/dashboards/sobreNos', function(req, res){
        res.render('dashboards/sobreNos')
	});

    application.get('/dashboards/redesSociais', function(req, res){
        res.render('dashboards/redesSociais', {msg:{}})
	});

    application.post('/dashboards/panel/filter', function(req, res){
        application.app.controllers.dashboard.filter(application, req, res)
	});

    application.get('/dashboards/panelControl', function(req, res){
        application.app.controllers.dashboard.panelControl(application, req, res)
	});

    /* Inserir Publicações */

    application.get('/dashboards/publicacoes', function(req, res){
        res.render('dashboards/inserirPublicacao', {msg:{}})
	});

    //application.post('/publicacoes/inserirPublicacao', function(req, res){
    //    application.app.controllers.publicacoes.inserirPublicacao(application, req, res)
	//});

    /* Redes Sociais */
    
    application.post('/TumblrStatus', function(req, res){
        application.app.controllers.dashboard.TumblrStatus(application, req, res)
	});

    application.get('/dashboards/midiasSociais/midias/DeslogarTumblr', function(req, res){
        application.app.controllers.dashboard.deslogarTumblr(application, req, res)
	});

    /* Tumblr */

    application.get('/dashboards/midiasSociais/midias/ConectarTumblr', function(req, res){
        res.render('dashboards/midiasSociais/conectarTumblr');
    });

    application.post('/dashboards/midiasSociais/midias/conectarTumblr/conectar', function(req, res){
        application.app.controllers.dashboard.conectarTumblr(application, req, res)
    });

    /* Registers CRUD */
    
    application.get('/dashboards/register/:id', function(req, res){
        application.app.controllers.dashboard.register(application, req, res)
    });

    application.get('/dashboards/register/delete/:id', function(req, res){
        application.app.controllers.dashboard.deleteRegister(application, req, res)
    });

    application.post('/dashboards/register/edit', function(req, res){
        application.app.controllers.dashboard.registerEdit(application, req, res)
    });

    application.post('/dashboards/register/edit', function(req, res){
        application.app.controllers.dashboard.registerEdit(application, req, res)
    });

    application.post('/dashboards/inserirPublicacao/inserir', function(req, res){
        application.app.controllers.dashboard.createPost(application, req, res)
    });

    /* Publicacoes Agendadas */

    application.post('/dashboards/panelControl/register', function(req, res){
        application.app.controllers.dashboard.panelControlRegister(application, req, res)
    });

    application.post('/dashboards/panelControl/register/public', function(req, res){
        application.app.controllers.dashboard.panelControlRegisterPublic(application, req, res)
    });

}