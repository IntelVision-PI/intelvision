export async function pegarDadosS3(ano, mes, dia, servidor) {
  const url = `http://localhost:3333/dados/${ano}/${mes}/${dia}/${servidor}`;

  const res = await fetch(url);
  if (!res.ok) {
    console.error("Erro no fetch:", res.status);
    return null;
  }

  const dados = await res.json();
  console.log("Dados da API:", dados);  

  return dados;
}
