const ctxDia = document.getElementById("requisicoesDia");

let servidores = [];
let servidoresProcessamento = [];
let dadosGrafico = [];

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
      listarServidores(data);
    });
}

function listarServidores(data) {
  console.log("Me chamou listarServidores(data)");
  console.log(data);
  servidores = data;
  const selectServidores = document.getElementById("fitro_nome_servidor");
  selectServidores.innerHTML = "<option value='Todos'>Todos</option>";

  for (let i = 0; i < data.length; i++) {
    const servidor = data[i];
    if (servidor.tipo == "Processamento") {
      servidoresProcessamento.push(servidor);
      selectServidores.innerHTML += `
            <option value="${servidor.id}">${servidor.nome}</option> 
          `;
    }
  }
}

function mostrarNavbar() {
  const larguraTela = window.innerWidth;
  var menu = document.getElementById("navbar");
  var icone = document.getElementById("icone");

  if (larguraTela < 1342) {
    if (getComputedStyle(menu).display == "none") {
      menu.style.display = "flex";
      icone.classList.remove("fa-bars");
      icone.classList.add("fa-times");
    } else {
      menu.style.display = "none";
      icone.classList.remove("fa-times");
      icone.classList.add("fa-bars");
    }
  }
}

function pegarInformacoesServidor(idServidor) {
  console.log(
    "Me chamou (pegarInformacoesServidor) do servidor com id " + idServidor
  );
  const tbodyServidoresCodec = document.getElementById(
    "tbody_servidores_codec"
  );
  tbodyServidoresCodec.innerHTML = ` <tr>
              <td>Carregando a tabela</td>
              <td>...</td>
            </tr>`;
  setTimeout(() => {
    if (idServidor == "Todos") {
      tbodyServidoresCodec.innerHTML = `
            <tr>
              <td>Quantidade Servidores Processamento</td>
              <td>${servidoresProcessamento.length}</td>
            </tr>
            <tr>
              <td>Quantidade Servidores Codec A</td>
              <td>1</td>
            </tr>
            <tr>
              <td>Quantidade Servidores Codec B</td>
              <td>2</td>
            </tr>
            <tr>
              <td>Quantidade Servidores Codec C</td>
              <td>1</td>
            </tr>
            <tr>
              <td>Quantidade Servidores Codec D</td>
              <td>0</td>
            </tr>
            <tr>
              <td>Quantidade Servidores Codec E</td>
              <td>0</td>
            </tr>
  
          `;
    } else {
      for (let i = 0; i < servidores.length; i++) {
        if (servidores[i].id == Number(idServidor)) {
          tbodyServidoresCodec.innerHTML = `
            <tr>
              <td>Nome</td>
              <td>${servidores[i].nome}</td>
            </tr>
            <tr>
              <td>Tipo Servidor</td>
              <td>${servidores[i].tipo}</td>
            </tr>
            <tr>
              <td>Sistema Operacional</td>
              <td>${servidores[i].sistema_operacional}</td>
            </tr>
            <tr>
              <td>Modelo</td>
              <td>${servidores[i].modelo}</td>
            </tr>
            <tr>
              <td>Service Tag</td>
              <td>${servidores[i].service_tag}</td>
            </tr>
            <tr>
              <td>Endereço MAC</td>
              <td>${servidores[i].macaddress}</td>
            </tr>

          `;
          break;
        }
      }
    }
  }, 1000);
}

function pegarRegistrosServidor(idServidor) {
  fetch("http://127.0.0.1:3000/s3Route/dados/csv_cliente_teste_lucas.csv")
    .then((response) => response.json())
    .then((json) => {
      dadosGrafico = json;
      // Pegar só uma parte do gráfico
      let dadosGraficoTeste = dadosGrafico.slice(0, 10);
      console.log(dadosGraficoTeste);
      plotarGraficoLinha(dadosGrafico);
    });
}

function plotarGraficoLinha(resposta) {
  console.log("iniciando plotagem do gráfico...");

  // Criando estrutura para plotar gráfico - labels
  let labels = [];

  // Criando estrutura para plotar gráfico - dados
  let dados = {
    labels: labels,
    datasets: [
      {
        label: "Tempo",
        data: [],
        backgroundColor: "rgba(40,167,69,0.2)",
        borderColor: "#28a745",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  console.log("----------------------------------------------");
  console.log(
    'Estes dados foram recebidos pela funcao "pegarRegistrosServidor" e passados para "plotarGrafico":'
  );
  console.log(resposta);

  // Inserindo valores recebidos em estrutura para plotar o gráfico
  // NOTA: Ajustar para que as Labels sejam em Horas pois isso é para omesmo dia
  for (i = 0; i < resposta.length; i++) {
    var registro = resposta[i];
    labels.push(registro.timestamp);
    dados.datasets[0].data.push(registro.proc1_cpu_pct);
  }

  console.log("----------------------------------------------");
  console.log("O gráfico será plotado com os respectivos valores:");
  console.log("Labels:");
  console.log(labels);
  console.log("Dados:");
  console.log(dados.datasets);
  console.log("----------------------------------------------");

  // Criando estrutura para plotar gráfico - config
  const config = {
    type: "line",
    data: dados,
    options: {
      scales: {
        x: {
          reverse: true,
        },
        y: {
          beginAtZero: true,
        },
      },
      responsive: true,
      plugins: { legend: { display: false } },
    },
  };

  // Adicionando título do gráfico
  let tituloGrafico = document.getElementById(
    "dash__conteudo__grupo__graficos__titulo"
  );
  tituloGrafico.innerHTML = "Porcentagem de CPU consumida no dia";
  // Adicionando gráfico criado em div na tela
  let myChart = new Chart(document.getElementById(`requisicoesHora`), config);

  //setTimeout(() => atualizarGrafico(idAquario, dados, myChart), 2000);
}

// Gráfico de Requisições por hora
/* const ctxHora = document.getElementById("requisicoesHora");
new Chart(ctxHora, {
  type: "line",
  data: {
    labels: ["00-04", "04-08", "08-12", "12-16", "16-20", "20-24"],
    datasets: [
      {
        label: "Porcentagem CPU (%)",
        data: [5000, 10000, 8000, 15000, 12000, 20000],
        backgroundColor: "rgba(40,167,69,0.2)",
        borderColor: "#28a745",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  },
  options: { responsive: true, plugins: { legend: { display: false } } },
}); */

/* new Chart(ctxDia, {
  type: "bar",
  data: {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"],
    datasets: [
      {
        label: "Requisições",
        data: [100000, 80000, 120000, 150000, 90000, 70000, 200000],
        backgroundColor: "#28a745",
        borderColor: "#145a32",
        borderWidth: 2,
      },
    ],
  },
  options: { responsive: true, plugins: { legend: { display: false } } },
}); */
