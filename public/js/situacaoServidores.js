let servidores = [];

function puxarDadosServidor() {
  /* Essa função puxa os dados de servidores do banco de dados */
  console.log("Me chamou puxarDadosServidor()");
  const idEmpresa = Number(sessionStorage.fkEmpresa);
  console.log(idEmpresa);

  fetch(`/servidores/select/servidor/${idEmpresa}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Erro na resposta da API");
      }
      return res.json();
    })
    .then((data) => {
      servidores = data;
      console.log(servidores);
      preencherCarrossel(data);
    });
}

function preencherCarrossel(data) {
  const trilhaCarrossel = document.getElementById("trilhaCarrosselServidores");
  for (let i = 0; i < data.length; i++) {
    const servidor = data[i];
    const cardServidor = document.createElement("div");
    cardServidor.className = "kpi";

    cardServidor.innerHTML = `
        <h4>Servidor: ${servidor.nome}</h4>
        <h4>Servidor: ${servidor.tipo}</h4>
            <p>CPU: 10%</p>
            <p>RAM: 10%</p>
            <p>Disco: 10%</p>
            <p>Rede: 10%</p>
      `;
    trilhaCarrossel.appendChild(cardServidor);
  }
}
