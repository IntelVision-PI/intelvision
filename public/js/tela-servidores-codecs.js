const ctxDia = document.getElementById("requisicoesDia");
const containerGrafico1 = document.getElementById(
  "dash__conteudo__grupo__graficos__container1"
);

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

  containerGrafico1.innerHTML = `
  <h3 id="dash__conteudo__grupo__graficos__titulo">
                  Aguarde ...
                </h3>
                <canvas id="requisicoesHora"></canvas>
  `;
  setTimeout(() => {
    if (idServidor == "Todos") {
      tbodyServidoresCodec.innerHTML = `
            <tr>
              <td>Quantidade Servidores Processamento</td>
              <td>${servidoresProcessamento.length}</td>
            </tr>
          `;
      pegarRegistrosServidor("Todos");
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
          pegarRegistrosServidor(servidores[i].nome);
          break;
        }
      }
    }
  }, 1000);
}

function pegarRegistrosServidor(nomeServidor) {
  if (nomeServidor == "Todos") {
    let promessas = [];

    for (let i = 0; i < servidoresProcessamento.length; i++) {
      let nomeServidorMinusculo = servidoresProcessamento[i].nome.toLowerCase();
      console.log(nomeServidorMinusculo);

      let url = `http://127.0.0.1:3000/s3Route/dados/dados_maquina_2025-11-27--${nomeServidorMinusculo}.json`;

      let p = fetch(url)
        .then((response) => {
          if (!response.ok) {
            console.log("Erro na resposta:", url);
            return null;
          }
          return response.json();
        })
        .catch((err) => {
          console.log("Erro no fetch:", err);
          return null;
        });

      promessas.push(p);
    }

    Promise.allSettled(promessas).then((resultados) => {
      resultados.forEach((resultado) => {
        if (resultado.status === "fulfilled" && resultado.value) {
          dadosGrafico.push(resultado.value);
        }
      });

      console.log("Dados finais:", dadosGrafico);

      // só agora plota o gráfico
      plotarGraficoLinhaTodos(dadosGrafico);
    });
  } else {
    for (let i = 0; i < servidoresProcessamento.length; i++) {
      if (servidoresProcessamento[i].nome == nomeServidor) {
        fetch(
          `http://127.0.0.1:3000/s3Route/dados/dados_maquina_2025-11-22-${nomeServidor}_cliente_teste_lucas.csv`
        )
          .then((response) => {
            if (response.ok) {
              return response;
            } else {
              console.log(
                "Deu erro na reposta de requisição do registro do servidor"
              );
            }
          })
          .then((json) => {
            console.log(json);
            if (json == undefined || json == null || json.size <= 0) {
              console.log("Resposta está vazia !");
              containerGrafico1.innerHTML = `
            <h3 id="dash__conteudo__grupo__graficos__titulo">
                            Não existem registros desse servidor
                          </h3>
                          <canvas id="requisicoesHora"></canvas>
            `;
            } else {
              dadosGrafico.push(json);
              console.log(dadosGrafico);
              plotarGraficoLinha(dadosGrafico);
            }
          })
          .catch((erro) => {
            console.log(erro);
            containerGrafico1.innerHTML = `
            <h3 id="dash__conteudo__grupo__graficos__titulo">
                            Não existem registros desse servidor
                          </h3>
                          <canvas id="requisicoesHora"></canvas>
            `;
          });
        break;
      }
    }
  }
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
        label: resposta[0].user,
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
  console.log(resposta[0]);

  // Inserindo valores recebidos em estrutura para plotar o gráfico
  // NOTA: Ajustar para que as Labels sejam em Horas pois isso é para omesmo dia
  for (i = 0; i < resposta[0].length; i++) {
    var registro = resposta[0][i];
    labels.push(registro.timestamp.split(" ")[1]);
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
          reverse: false,
        },
        y: {
          max: 100,
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
  tituloGrafico.innerHTML = "Porcentagem de CPU consumida em 22/11/2025";
  // Adicionando gráfico criado em div na tela
  let myChart = new Chart(document.getElementById(`requisicoesHora`), config);
  dadosGrafico = [];

  //setTimeout(() => atualizarGrafico(idAquario, dados, myChart), 2000);
}

function plotarGraficoLinhaTodos(arrayRespostas) {
  console.log("iniciando plotagem do gráfico de todos servidores...");
  console.log(arrayRespostas);

  // Criando estrutura para plotar gráfico - labels
  let labels = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23,
  ];

  // Criando estrutura para plotar gráfico - daatsets
  let datasets = [];
  let dataIteracao = [];

  // criando um dataset de cada item do array

  for (i = 0; i < arrayRespostas.length; i++) {
    for (j = 0; j < arrayRespostas[i].length; j++) {
      var registro = arrayRespostas[i][j];
      //labels.push(registro.timestamp.split(" ")[1]);
      dataIteracao.push(registro.proc1_cpu_pct);
    }
    var nomeLabel = arrayRespostas[i][0].user;
    var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    let objetoIteracao = {
      label: nomeLabel,
      data: dataIteracao,
      backgroundColor: "rgba(125,187,249,0.2)",
      borderColor: randomColor,
      borderWidth: 2,
      fill: false,
      tension: 0.4,
    };
    console.log("Objeto a ser jogado em datasets");
    console.log(objetoIteracao);
    datasets.push(objetoIteracao);
    dataIteracao = [];
  }
  console.log("Dados a serem jogado em datasets");
  console.log(datasets);

  // Criando estrutura para plotar gráfico - dados
  let dados = {
    labels: labels,
    datasets: datasets,
  };

  // Inserindo valores recebidos em estrutura para plotar o gráfico
  // NOTA: Ajustar para que as Labels sejam em Horas pois isso é para omesmo dia

  // Criando estrutura para plotar gráfico - config
  const config = {
    type: "line",
    data: dados,
    options: {
      scales: {
        x: {
          reverse: false,
        },
        y: {
          max: 100,
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
  tituloGrafico.innerHTML =
    "Porcentagem de CPU consumida dos servidores de processamento em 22/11/2025";
  // Adicionando gráfico criado em div na tela
  let myChart = new Chart(document.getElementById(`requisicoesHora`), config);

  dadosGrafico = [];

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
