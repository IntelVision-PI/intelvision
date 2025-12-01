var situacaoModel = require("../models/situacaoModel");

function buscarParametro(req, res) {
    let idComponente = req.body.idComponente;

    situacaoModel.buscarParametro(idComponente).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar Paramêtros por empresa.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    })
}


async function buscarChamadosS3(req, res) {
    const resultado = await comparativoModel.buscarChamadosS3();
    if (!resultado) {
        return res.status(404).json({ erro: "Arquivo não encontrado no S3" });
    }
    res.json(resultado);
}

function buscarTodos(req, res) {
    situacaoModel.buscarTodos().then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar Paramêtros por empresa.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    })
}

module.exports = {
    buscarTodos,
    buscarParametro,
    buscarChamadosS3
};