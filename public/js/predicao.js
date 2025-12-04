let dados2024 = null;
let dados2025 = null;

async function carregarArquivosS3() {
  try {
    const ano = "2025";
    const mes = "11";
    const dia = "27";
    const servidor1 = "servidor14.jasudjc-2025.json";
    const servidor2 = "servidor14.jasudjc-2024.json";

    // Arquivo Ano Atual
    const r2025 = await fetch(`/predicoes/${ano}/${mes}/${dia}/${servidor1}`);

    if (r2025.ok) dados2025 = await r2025.json();
    else console.error("Erro ao buscar servidor14.jasudjc-2025.json");

    // Arquivo Ano Anterior
    const r2024 = await fetch(`/predicoes/${ano}/${mes}/${dia}/${servidor2}`);
    if (r2024.ok) dados2024 = await r2024.json();
    else console.error("Erro ao buscar servidor14.jasudjc-2024.json");

  } catch (e) {
    console.error("Falha ao carregar arquivos S3:", e);
  }
}

async function buscarDadosS3(ano, mes, dia, servidor) {
  const bucket = "client-testee";

  const servidorLower = servidor.toLowerCase(); 

const key = `${ano}/${mes}/${dia}/dados_maquina_${ano}-${mes}-${dia}--${servidor.toLowerCase()}.json`;

  console.log("-------------------------------------------------");
  console.log(` Predição: [S3 DEBUG] Tentando buscar no Bucket: ${bucket}`);
  console.log(` Predição: [S3 DEBUG] Caminho (Key) gerado: ${key}`);
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

// async function pegarDadosS3(ano, mes, dia, servidor) {
//   const url = `/dados/${ano}/${mes}/${dia}/${servidor}`;
//   try {
//       const res = await fetch(url, { cache: "no-store" });
//       if (!res.ok) return [];
//       const json = await res.json();
//       return json.dados || json || [];
//   } catch { return []; }
// }

