const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const database = require("../database/config");
const s3 = new S3Client({ region: process.env.AWS_REGION || "us-east-1" });
const bucket = "leticia04251048-client";

async function streamParaString(stream) {
    return await new Promise((resolve, reject) => {
        let data = "";
        stream.on("data", chunk => data += chunk);
        stream.on("end", () => resolve(data));
        stream.on("error", reject);
    });
}

async function buscarDadosS3(ano, mes, dia, servidor) {
    const servidorTransformado = servidor.toLowerCase();

    const key = `${ano}/${mes}/${dia}/dados_maquina_${ano}-${mes}-${dia}--${servidorTransformado}.json`;

    console.log("-------------------------------------------------");
    console.log(`[S3 DEBUG] Tentando buscar no Bucket: ${bucket}`);
    console.log(`[S3 DEBUG] Caminho (Key) gerado: ${key}`);
    console.log("-------------------------------------------------");

    const params = { Bucket: bucket, Key: key };

    try {
        const response = await s3.send(new GetObjectCommand(params));
        const bodyString = await streamParaString(response.Body);
        return JSON.parse(bodyString);
    } catch (err) {
        console.error(`[S3 ERRO] Falha ao baixar o arquivo: ${key}`);
        console.error(`[S3 ERRO] Detalhe: ${err.message || err.Code}`);
        return null;
    }
}

function buscarParametros(empresa) {
    let instrucaoSql = `
        SELECT * FROM parametro p
            INNER JOIN componente c ON c.id = p.fkComponente
            INNER JOIN servidor s ON s.id = p.fkServidor 
            INNER JOIN empresa e ON e.id = s.fkEmpresa
        WHERE e.id = ${empresa};
    `;
    console.log(
        "Executando a instrução SQL (buscarParametro parametro): \n" + instrucaoSql
    );
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarDadosS3,
    buscarParametros
};