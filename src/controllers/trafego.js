var trafegoModel = require("../models/trafego");

function buscarDados(req, res) {
    var ano = req.params.ano;
    var mes = req.params.mes;
    var dia = req.params.dia;
    var servidor = req.params.servidor;

    if (ano == undefined || mes == undefined || dia == undefined || servidor == undefined) {
        res.status(400).send("Parâmetros inválidos!");
    } else {
        trafegoModel.buscarDadosS3(ano, mes, dia, servidor)
            .then(
                function (resultado) {
                    if (resultado) {
                        res.json(resultado);
                    } else {
                        res.status(404).send("Arquivo não encontrado no S3");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao buscar os dados! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function buscarServidores(req, res) {
    trafegoModel.buscarServidores()
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        }).catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao realizar a consulta! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

module.exports = {
    buscarDados,
    buscarServidores
}