let servidorModel = require("../models/servidorModel");


function cadastrarServidor(req, res) {
    let nomeServidor = req.body.nomeServidor;
    let sistemaOperacional = req.body.sistemaOperacional;
    let macAddress = req.body.macAddress;
    let tipoServidor = req.body.tipoServidor;
    let fkEmpresa = req.body.fkEmpresa;

  servidorModel
    .cadastrarServidor(nomeServidor, sistemaOperacional, macAddress, tipoServidor, fkEmpresa)
    .then(function (resultado) {
      res.json(resultado);
    })
    .catch(function (erro) {
      console.log(erro);
      console.log(
        "\nHouve um erro ao realizar o cadastro do servidor! Erro: ",
        erro.sqlMessage
      );
      res.status(500).json(erro.sqlMessage);
    });
}


module.exports = {
    cadastrarServidor
}