const { buscarDadosS3 } = require("../models/comparativo");

async function pegarDados(req, res) {
    const { ano, mes, dia, servidor } = req.params;

    const resultado = await buscarDadosS3(ano, mes, dia, servidor);

    if (!resultado) {
        return res.status(404).json({ erro: "Arquivo não encontrado no S3" });
    }

    res.json(resultado);
}

module.exports = { pegarDados };
