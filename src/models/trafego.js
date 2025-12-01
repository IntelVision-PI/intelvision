var database = require("../database/config");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({ 
    region: process.env.AWS_REGION || "us-east-1" 
});

async function streamParaString(stream) {
    return await new Promise((resolve, reject) => {
        let data = "";
        stream.on("data", chunk => data += chunk);
        stream.on("end", () => resolve(data));
        stream.on("error", reject);
    });
}

async function buscarDadosS3(ano, mes, dia, servidor) {
<<<<<<< HEAD
    const bucket = "my-bucket-client-nicolas";
=======
    const bucket = "s3-client-04251119"; // Seu bucket
>>>>>>> b3a562b7d036fa5df6db250581b77c042899684e
    const servidorTransformado = servidor.toLowerCase();
    
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