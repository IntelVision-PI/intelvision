let dados2024 = null;
let dados2025 = null;

async function carregarArquivosS3() {
  try {
    const ano = "2025";
    const mes = "11";
    const dia = "27";

    // Arquivo Ano Atual
    const r2025 = await fetch(`/predicoes/${ano}/${mes}/${dia}/servidor14.jasudjc-2025`);
    if (r2025.ok) dados2025 = await r2025.json();
    else console.error("Erro ao buscar servidor14.jasudjc-2025.json");

    // Arquivo Ano Anterior
    const r2024 = await fetch(`/predicoes/${ano}/${mes}/${dia}/servidor14.jasudjc-2024`);
    if (r2024.ok) dados2024 = await r2024.json();
    else console.error("Erro ao buscar servidor14.jasudjc-2024.json");

  } catch (e) {
    console.error("Falha ao carregar arquivos S3:", e);
  }
}
