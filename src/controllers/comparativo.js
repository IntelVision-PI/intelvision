const comparativoModel = require("../models/comparativo");

async function pegarDados(req, res) {
    const { ano, mes, dia, servidor } = req.params;
    const resultado = await comparativoModel.buscarDadosS3(ano, mes, dia, servidor);
    if (!resultado) {
        return res.status(404).json({ erro: "Arquivo não encontrado no S3" });
    }
    res.json(resultado);
}

function pegarServidores(req, res) {
    comparativoModel.buscarServidores()
        .then(resultado => res.json(resultado))
        .catch(err => {
            console.error("Erro buscarServidores:", err);
            res.status(500).json({ erro: "Erro ao buscar servidores" });
        });
}

async function buscarChamadosS3(req, res) {
    const resultado = await comparativoModel.buscarChamadosS3();
    if (!resultado) {
        return res.status(404).json({ erro: "Arquivo não encontrado no S3" });
    }
    res.json(resultado);
}

module.exports = {
    pegarDados,
    pegarServidores,
    buscarChamadosS3
};
