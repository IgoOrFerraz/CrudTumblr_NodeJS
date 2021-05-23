let express = require('express')
let consign = require('consign')
let bodyParser = require('body-parser')
let expressValidator = require('express-validator')
let expressSession = require('express-session')

let app = express()

/* -- DECLARAÇÃO DA EXTENSÃO APLICADA E LOCALIZAÇÃO DAS VIEWS UTILIZANDO EXPRESS -- */
app.set('view engine', 'ejs');
app.set('views', './app/views');

/* ----- Middlewares ---- */

/* definição do caminho dos componentes estáticos */
app.use(express.static('./app/public'));

/* configurar o middleware body-parser */
app.use(bodyParser.urlencoded({extended: true}));

/* configurar o middleware express-validator */
app.use(expressValidator());

/* configurar o middleware express-session */
app.use(expressSession({
	secret: 'testsession',
	resave: false,
	saveUninitialized: false 
}));

/* ---------------------------------------------------------------------------------- */

/* -- AUTOLOAD DOS DIRETÓRIOS ABAIXO DENTRO DO OBJ APP -- */
consign()
	.include('app/routes.js')
	.then('config/dbConnection.js')
	.then('app/models')
	.then('app/controllers')
	.into(app);

module.exports = app;