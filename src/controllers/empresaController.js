let empresaService = require("../services/empresaService");
let empresaModel = require("../models/empresaModel");

function cadastrarUsuario(req, res) {
    let nomeUsuario = req.body.nome;
    let emailUsuario = req.body.email;
    let senhaUsuario = req.body.senha;
    let fkEmpresa = req.body.fkEmpresa;
    
    empresaService.cadastrarUsuario(nomeUsuario, emailUsuario, senhaUsuario, fkEmpresa)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {   
                console.log(erro);
                console.log(
                    "\nHouve um erro ao realizar o cadastro! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}

module.exports = {
    cadastrarUsuario
}