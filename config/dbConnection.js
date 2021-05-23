const mysql = require('mysql')
 
let connection = function(){
    
    return mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '1234',
        database: 'socialmedia_system'
    })
}

module.exports = () => connection