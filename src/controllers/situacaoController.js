var situacaoModel = require("../models/situacaoModel");

async function buscarDadosS3(req, res) {
    const { ano, mes, dia, servidor } = req.params;
    const resultado = await comparativoModel.buscarDadosS3(ano, mes, dia, servidor);
    if (!resultado) {
        return res.status(404).json({ erro: "Arquivo não encontrado no S3" });
    }
    res.json(resultado);
}

function buscarParametros(req, res) {
    var idEmpresa = req.params.idEmpresa;

    situacaoModel.buscarParametros(idEmpresa).then(function(resultado){
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
    buscarDadosS3,
    buscarParametros
};