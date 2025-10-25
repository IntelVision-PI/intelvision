let servidores = [];
let registroServidoresUltimo = [];

function puxarDadosServidor() {
  /* Essa função puxa os dados de servidores do banco de dados */
  console.log("Me chamou puxarDadosServidor()");
  const idEmpresa = Number(sessionStorage.fkEmpresa);
  console.log(idEmpresa);

  fetch("/dados_csv/csv_tratado_teste.csv")
    .then((response) => response.text())
    .then((csv) => {
      let arrayObjRegistros = [];
      let arrayCsv = csv.toString().split("\n");
      let headers = arrayCsv[0].split(";");
      var listaNomeServidores = [];
      for (var i = arrayCsv.length - 2; i >= 1; i--) {
        var data = arrayCsv[i].split(";");
        var objCadaRegistro = {};
        if (!listaNomeServidores.includes(data[0])) {
          listaNomeServidores.push(data[0]);
          for (var j = 0; j < data.length; j++) {
            objCadaRegistro[headers[j].trim()] = data[j].trim();
          }
          arrayObjRegistros.push(objCadaRegistro);
        }
      }
      registroServidoresUltimo = arrayObjRegistros;
      console.log(registroServidoresUltimo);
    });

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
    console.log(servidor);
    for (let j = 0; j < registroServidoresUltimo.length; j++) {
      let nomeServidorIteracao = registroServidoresUltimo[j].user.split(".")[0];
      console.log(nomeServidorIteracao);
      if (nomeServidorIteracao == servidor.nome) {
        if (
          registroServidoresUltimo[j].cpu > 85 ||
          registroServidoresUltimo[j].ram > 85 ||
          registroServidoresUltimo[j].disco > 85
        ) {
          cardServidor.classList = "kpi kpiCritico";
        } else if (
          registroServidoresUltimo[j].cpu > 75 ||
          registroServidoresUltimo[j].ram > 75 ||
          registroServidoresUltimo[j].disco > 75
        ) {
          cardServidor.classList = "kpi kpiAlerta";
        } else {
          cardServidor.classList = "kpi kpiOk";
        }

        cardServidor.innerHTML = `
        <h4>Servidor: ${servidor.nome}</h4>
        <h4>Servidor: ${servidor.tipo}</h4>
            <p>CPU: ${registroServidoresUltimo[j].cpu}%</p>
            <p>RAM: ${registroServidoresUltimo[j].ram}%</p>
            <p>Disco: ${registroServidoresUltimo[j].disco}%</p>
      `;
        break;
      }
    }

    trilhaCarrossel.appendChild(cardServidor);
  }
}
