var servidorModel = require("../models/servidorModel");

function cadastrarServidor(req, res) {
    let nomeServidor = req.body.nomeServidor;
    let sistemaOperacional = req.body.sistemaOperacional;
    let macAddress = req.body.macAddress;
    let tipoServidor = req.body.tipoServidor;
    let modelo = req.body.modelo;
    let serviceTag = req.body.serviceTag;
    let fkEmpresa = req.body.fkEmpresa;

    if (nomeServidor == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else {
        servidorModel.cadastrarServidor(nomeServidor, sistemaOperacional, macAddress, tipoServidor, modelo, serviceTag, fkEmpresa)
            .then((resultado) => res.json(resultado))
            .catch((erro) => {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function cadastrarComponentes(req, res) {
    let nomeComponente = req.body.nomeComponente;
    let unidade_medida = req.body.unidade_medida;

    servidorModel.cadastrarComponentes(nomeComponente, unidade_medida)
        .then((resultado) => res.json(resultado))
        .catch((erro) => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function cadastrarParametro(req, res) {
    let fkServidor = req.body.fkServidor;
    let fkComponente = req.body.fkComponente;
    let alerta_min = req.body.alerta_min;
    let alerta_max = req.body.alerta_max;

    servidorModel.cadastrarParametro(fkServidor, fkComponente, alerta_min, alerta_max)
        .then((resultado) => res.json(resultado))
        .catch((erro) => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function obterServidores(req, res) {
    const idEmpresa = req.params.idEmpresa;
    servidorModel.obterServidores(idEmpresa)
        .then((resultado) => res.json(resultado))
        .catch((erro) => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarServidorPorId(req, res) {
    var idServidor = req.params.idServidor;

    servidorModel.buscarServidorPorId(idServidor)
        .then((resultado) => {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        })
        .catch((erro) => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function atualizarServidor(req, res) {
    var idServidor = req.params.idServidor;
    var nome = req.body.nome;
    var modelo = req.body.modelo;
    var so = req.body.so;
    var tipo = req.body.tipo;

    servidorModel.atualizarServidor(idServidor, nome, modelo, so, tipo)
        .then((resultado) => res.json(resultado))
        .catch((erro) => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarParametros(req, res) {
    var idServidor = req.params.idServidor;

    servidorModel.buscarParametrosPorIdServidor(idServidor)
        .then((resultado) => {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum parâmetro encontrado!");
            }
        })
        .catch((erro) => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function atualizarParametros(req, res) {
    var idServidor = req.params.idServidor;
    var dados = req.body; 

    servidorModel.atualizarParametros(idServidor, dados)
        .then((resultado) => {
            res.json(resultado);
        })
        .catch((erro) => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    cadastrarServidor,
    obterServidores,
    cadastrarComponentes,
    cadastrarParametro,
    buscarServidorPorId,
    atualizarServidor,
    buscarParametros,
    atualizarParametros
};