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
    const bucket = "my-bucket-client-nicolas";
const key = `${ano}/${mes}/${dia}/dados_maquina_${ano}-${mes}-${dia}--${servidor}.json`;

    const params = {
        Bucket: bucket,
        Key: key
    };

    try {
        const response = await s3.send(new GetObjectCommand(params));

        const bodyString = await streamParaString(response.Body);
        return JSON.parse(bodyString);

    } catch (err) {
        console.error("Erro ao ler S3:", err.message);
        return null;
    }
}

module.exports = { buscarDadosS3 };
