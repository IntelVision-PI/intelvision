var database = require("../database/config");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

// Configuração do cliente S3 (Pega as credenciais do "aws configure" ou variáveis de ambiente)
const s3 = new S3Client({ 
    region: process.env.AWS_REGION || "us-east-1" 
});

// Função auxiliar para transformar o stream do S3 em string/json
async function streamParaString(stream) {
    return await new Promise((resolve, reject) => {
        let data = "";
        stream.on("data", chunk => data += chunk);
        stream.on("end", () => resolve(data));
        stream.on("error", reject);
    });
}

// Busca o JSON no Bucket S3
async function buscarDadosS3(ano, mes, dia, servidor) {
    const bucket = "my-bucket-client-nicolas"; // Seu bucket
    const servidorTransformado = servidor.toLowerCase();
    
    // Caminho do arquivo
    const key = `${ano}/${mes}/${dia}/dados_maquina_${ano}-${mes}-${dia}--${servidorTransformado}.json`;
    
    console.log(`[Model] Buscando no S3: ${key}`);

    const params = { Bucket: bucket, Key: key };

    try {
        const command = new GetObjectCommand(params);
        const response = await s3.send(command);
        const bodyString = await streamParaString(response.Body);
        return JSON.parse(bodyString);
    } catch (err) {
        console.error(`[Model] Erro S3: ${err.name} - ${err.message}`);
        return null;
    }
}

// Busca a lista de servidores no Banco de Dados (MySQL/SQL Server)
function buscarServidores() {
    var instrucao = `
        SELECT * FROM servidor;
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    buscarDadosS3,
    buscarServidores
};