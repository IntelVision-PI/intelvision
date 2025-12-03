const ctxDia = document.getElementById("requisicoesDia");
const containerGrafico1 = document.getElementById(
  "dash__conteudo__grupo__graficos__container1"
);
const selectServidores = document.getElementById("fitro_nome_servidor");

const dataHoje = new Date();
const formatoBrasileiro = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "medium",
});
console.log("Data Brasileira");
console.log(formatoBrasileiro.format(dataHoje));
const formatoDataCurta = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
});
console.log("Data Brasileira Curta");
console.log(formatoDataCurta.format(dataHoje));

let dataSelecionada;

let servidores = [];
let servidoresProcessamento = [];
let dadosGrafico = [];

function puxarDadosServidor() {
  /* Essa função puxa os dados de servidores do banco de dados */
  console.log("Me chamou puxarDadosServidor()");
  const idEmpresa = Number(sessionStorage.fkEmpresa);
  console.log(idEmpresa);

  fetch(`/servidores/select/servidorCodecs/${idEmpresa}`, {
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
      console.log(data);
      listarServidores(data);
    });
}

function listarServidores(data) {
  console.log("Me chamou listarServidores(data)");
  console.log(data);
  servidores = data;

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
      let arrayCodecs = servidores.map((servidorAtual) => {
        return servidorAtual.codec;
      });
      console.log(arrayCodecs);
      tbodyServidoresCodec.innerHTML = `
            <tr>
              <td>Quantidade Servidores Processamento</td>
              <td>${servidoresProcessamento.length}</td>
            </tr>
            <tr>
              <td>Quantidade Servidores CODEC H.265</td>
              <td>${arrayCodecs.filter((x) => x === "H-265").length}</td>
            </tr>
            <tr>
              <td>Quantidade Servidores CODEC H.264</td>
              <td>${arrayCodecs.filter((x) => x === "H-264").length}</td>
            </tr>
            <tr>
              <td>Quantidade Servidores CODEC MPEG-2</td>
              <td>${arrayCodecs.filter((x) => x === "MPEG-2").length}</td>
            </tr>
            <tr>
              <td>Quantidade Servidores Outros CODECS</td>
              <td>${
                servidoresProcessamento.length -
                arrayCodecs.filter((x) => x === "H-265").length -
                arrayCodecs.filter((x) => x === "MPEG-2").length -
                arrayCodecs.filter((x) => x === "H-264").length
              }</td>
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
            <tr>
              <td>CODEC</td>
              <td>${servidores[i].codec}</td>
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
  let arrayDataSelecionada = formatoDataCurta
    .format(dataSelecionada)
    .split("/");
  console.log(arrayDataSelecionada);

  if (nomeServidor == "Todos") {
    let promessas = [];

    for (let i = 0; i < servidoresProcessamento.length; i++) {
      let nomeServidorMinusculo = servidoresProcessamento[i].nome.toLowerCase();
      console.log(nomeServidorMinusculo);

      let url = `http://127.0.0.1:3000/s3Route/dados/dados_maquina_${arrayDataSelecionada[2]}-${arrayDataSelecionada[1]}-${arrayDataSelecionada[0]}--${nomeServidorMinusculo}.json`;

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
        console.log(resultado.value);
        if (
          resultado.status === "fulfilled" &&
          resultado.value &&
          resultado.value.length > 0
        ) {
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
          `http://127.0.0.1:3000/s3Route/dados/dados_maquina_${
            arrayDataSelecionada[2]
          }-${arrayDataSelecionada[1]}-${
            arrayDataSelecionada[0]
          }--${nomeServidor.toLowerCase()}.json`
        )
          .then((response) => {
            if (response.ok) {
              return response.json();
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

  console.log(resposta);
  // Criando estrutura para plotar gráfico - dados
  let dados = {
    labels: labels,
    datasets: [
      {
        label: resposta[0][0].user,
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
  for (i = 0; i < resposta[0].length; i += 30) {
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
      plugins: { legend: { display: true } },
    },
  };

  // Adicionando título do gráfico
  let tituloGrafico = document.getElementById(
    "dash__conteudo__grupo__graficos__titulo"
  );
  tituloGrafico.innerHTML = `Porcentagem de CPU consumida do CODEC em ${formatoDataCurta.format(
    dataSelecionada
  )}`;
  // Adicionando gráfico criado em div na tela
  let myChart = new Chart(document.getElementById(`requisicoesHora`), config);
  dadosGrafico = [];

  //setTimeout(() => atualizarGrafico(idAquario, dados, myChart), 2000);
}

function plotarGraficoLinhaTodos(arrayRespostas) {
  console.log("iniciando plotagem do gráfico de todos servidores...");
  console.log(arrayRespostas);

  if (arrayRespostas.length <= 0) {
    containerGrafico1.innerHTML = `
            <h3 id="dash__conteudo__grupo__graficos__titulo">
                            Não existem registros desses servidores nesse dia
                          </h3>
                          <canvas id="requisicoesHora"></canvas>
            `;
    return;
  }

  // Criando estrutura para plotar gráfico - labels
  let labels = [
    "00:00",
    "00:15",
    "00:30",
    "00:45",
    "01:00",
    "01:15",
    "01:30",
    "01:45",
    "02:00",
    "02:15",
    "02:30",
    "02:45",
    "03:00",
    "03:15",
    "03:30",
    "03:45",
    "04:00",
    "04:15",
    "04:30",
    "04:45",
    "05:00",
    "05:15",
    "05:30",
    "05:45",
    "06:00",
    "06:15",
    "06:30",
    "06:45",
    "07:00",
    "07:15",
    "07:30",
    "07:45",
    "08:00",
    "08:15",
    "08:30",
    "08:45",
    "09:00",
    "09:15",
    "09:30",
    "09:45",
    "10:00",
    "10:15",
    "10:30",
    "10:45",
    "11:00",
    "11:15",
    "11:30",
    "11:45",
    "12:00",
    "12:15",
    "12:30",
    "12:45",
    "13:00",
    "13:15",
    "13:30",
    "13:45",
    "14:00",
    "14:15",
    "14:30",
    "14:45",
    "15:00",
    "15:15",
    "15:30",
    "15:45",
    "16:00",
    "16:15",
    "16:30",
    "16:45",
    "17:00",
    "17:15",
    "17:30",
    "17:45",
    "18:00",
    "18:15",
    "18:30",
    "18:45",
    "19:00",
    "19:15",
    "19:30",
    "19:45",
    "20:00",
    "20:15",
    "20:30",
    "20:45",
    "21:00",
    "21:15",
    "21:30",
    "21:45",
    "22:00",
    "22:15",
    "22:30",
    "22:45",
    "23:00",
    "23:15",
    "23:30",
    "23:45",
  ];

  // Criando estrutura para plotar gráfico - daatsets
  let datasets = [];
  let dataIteracao = [];

  // criando um dataset de cada item do array

  for (i = 0; i < arrayRespostas.length; i++) {
    for (j = 0; j < arrayRespostas[i].length; j += 6) {
      var registro = arrayRespostas[i][j];

      let dataRegistro = registro.timestamp.split(" ")[1].substring(0, 5);
      console.log(dataRegistro);
      if (labels.includes(dataRegistro)) {
        for (k = 0; k < labels.length; k++) {
          if (dataRegistro == labels[k]) {
            console.log("Vou plotar" + registro.proc1_cpu_pct);
            dataIteracao.push(registro.proc1_cpu_pct);
            break;
          } else if (dataIteracao[k] == undefined) {
            dataIteracao.push(null);
          }
        }
      }
      //labels.push(registro.timestamp.split(" ")[1]);
    }
    var nomeLabel = arrayRespostas[i][0].user;
    var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    let objetoIteracao = {
      label: nomeLabel,
      data: dataIteracao,
      backgroundColor: randomColor,
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
      plugins: { legend: { display: true } },
      spanGaps: true,
    },
  };

  // Adicionando título do gráfico
  let tituloGrafico = document.getElementById(
    "dash__conteudo__grupo__graficos__titulo"
  );
  tituloGrafico.innerHTML = `Porcentagem de CPU consumida dos CODECS em ${formatoDataCurta.format(
    dataSelecionada
  )}`;
  // Adicionando gráfico criado em div na tela
  let myChart = new Chart(document.getElementById(`requisicoesHora`), config);

  dadosGrafico = [];

  //setTimeout(() => atualizarGrafico(idAquario, dados, myChart), 2000);
}

function pegarDataServidor() {
  let dataFiltro = document.getElementById("filtro_data_servidor").value;
  if (dataFiltro == "" || dataFiltro == null) {
    dataSelecionada = new Date().setDate(dataHoje.getDate() - 1);
    console.log(formatoDataCurta.format(dataSelecionada));
  } else {
    console.log(dataFiltro);
    console.log(typeof dataFiltro);
    let arrayDataFiltro = dataFiltro.split("-");
    console.log(arrayDataFiltro);
    dataSelecionada = new Date(
      arrayDataFiltro[0],
      arrayDataFiltro[1] - 1,
      arrayDataFiltro[2]
    );
    console.log(formatoDataCurta.format(dataSelecionada));
    selectServidores.selectedIndex = 0;
    pegarInformacoesServidor("Todos");
  }

  //
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
