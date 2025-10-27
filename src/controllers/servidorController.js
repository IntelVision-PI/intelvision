let servidorModel = require("../models/servidorModel");


function cadastrarServidor(req, res) {
    let nomeServidor = req.body.nomeServidor;
    let sistemaOperacional = req.body.sistemaOperacional;
    let macAddress = req.body.macAddress;
    let tipoServidor = req.body.tipoServidor;
    let modelo = req.body.modelo;
    let serviceTag = req.body.serviceTag;
    let fkEmpresa = req.body.fkEmpresa;

  servidorModel
    .cadastrarServidor(nomeServidor, sistemaOperacional, macAddress, tipoServidor, modelo,
      serviceTag, fkEmpresa)
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

function cadastrarComponentes(req, res) {
    let nomeComponente = req.body.nomeComponente;
    let unidade_medida = req.body.unidade_medida;

  servidorModel
    .cadastrarComponentes(nomeComponente, unidade_medida)
    .then(function (resultado) {
      res.json(resultado);
    })
    .catch(function (erro) {
      console.log(erro);
      console.log(
        "\nHouve um erro ao realizar o cadastro os componentes do servidor! Erro: ",
        erro.sqlMessage
      );
      res.status(500).json(erro.sqlMessage);
    });
}

function cadastrarParametro(req, res) {
    let fkServidor = req.body.fkServidor;
    let fkComponente = req.body.fkComponente;
    let alerta_min = req.body.alerta_min;
    let alerta_max = req.body.alerta_max;

  servidorModel
    .cadastrarParametro(fkServidor, fkComponente, alerta_min, alerta_max)
    .then(function (resultado) {
      res.json(resultado);
    })
    .catch(function (erro) {
      console.log(erro);
      console.log(
        "\nHouve um erro ao realizar o cadastro do parametro! Erro: ",
        erro.sqlMessage
      );
      res.status(500).json(erro.sqlMessage);
    });
}

function obterServidores(req, res) {
  const idEmpresa = req.params.idEmpresa;

  servidorModel
    .obterServidores(idEmpresa)
    .then(function (resultado) {
      res.json(resultado);
    })
    .catch(function (erro) {
      console.log(erro);
      console.log("\n (Function: obterServidores) Houve um erro ao buscar! Erro: ", erro.sqlMessage);
      res.status(500).json(erro.sqlMessage);
    });
}


module.exports = {
    cadastrarServidor,
    obterServidores,
    cadastrarComponentes,
    cadastrarParametro
}