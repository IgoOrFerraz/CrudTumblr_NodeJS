function publicacoesDAO(connection){
    this._connection = connection
}

publicacoesDAO.prototype.pegarPublicAgendadas = function(req, res){

    //res.send(req.session)
    
    this._connection.query("SELECT * FROM publications WHERE id_user = ?", [req.session.usuarioID], (error, data) => {       
        if(error) throw error
        //else res.send(data)

        data.map(function(value, index){
            
            let time = value.hora.split(':')
            let dataTime = new Date(value.data.getFullYear() + "-" + (value.data.getMonth() + 1) + "-" + value.data.getDate())
            data[index].data = value.data.getFullYear() + "-" + (value.data.getMonth() + 1) + "-" + value.data.getDate()
            dataTime.setUTCHours(time[0])
            dataTime.setUTCMinutes(time[1])
            
            let dataAgor = new Date()
            dataAgor.setUTCHours(dataAgor.getHours())
            let momento_atual = dataAgor.getTime()

            data[index].dataTime = (Date.parse(dataTime) - momento_atual)/1000
        })

        //res.send(data)

        res.render('dashboards/panelControl', {dados: data})
    })
    
}

publicacoesDAO.prototype.inserirPublicacao = function(dados, req, res){

    this._connection.query("INSERT INTO publications SET id_user = ?, titulo = ?, body = ?, data = ?, hora = ?", [req.session.usuarioID, dados.title, dados.body, dados.date, dados.time], (error) => {
        
        if(error) throw error
    })
    return true
}

publicacoesDAO.prototype.pegarPublic = function(register, req, res){
    
    let ids = register.split('_')

    this._connection.query("SELECT * FROM publications WHERE id_pub = ? and id_user = ? LIMIT 1", [ids[0], ids[1]], (error, data) => {
        if(error) throw error
        else{
            postsFilter = JSON.stringify(data[0]);
            res.end(postsFilter)
        }
    })
}

publicacoesDAO.prototype.deletarPubAgor = function(req, res, ids){
    
    this._connection.query("DELETE FROM publications WHERE id_pub = ? and id_user = ? LIMIT 1", [ids.id_pub, ids.id_user], (error) => {
        if(error) throw error
    })
    
}
module.exports = () => publicacoesDAO