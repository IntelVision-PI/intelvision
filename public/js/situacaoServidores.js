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
  var tipoServidor = fitro_tipo_servidor.value;
  var situacaoServidor = fitro_situacao_servidor.value;
  const trilhaCarrossel = document.getElementById("trilhaCarrosselServidores");
  trilhaCarrossel.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    const servidor = data[i];
    const cardServidor = document.createElement("div");
    console.log(servidor);
    for (let j = 0; j < registroServidoresUltimo.length; j++) {
      let nomeServidorIteracao = registroServidoresUltimo[j].user.split(".")[0];
      console.log(nomeServidorIteracao);
      if (
        nomeServidorIteracao == servidor.nome.split(".")[0] &&
        (tipoServidor.toLowerCase() == servidor.tipo.toLowerCase() ||
          tipoServidor == "Todos")
      ) {
        if (
          (situacaoServidor == "critico" || situacaoServidor == "Todos") &&
          (registroServidoresUltimo[j].cpu > 85 ||
            registroServidoresUltimo[j].ram > 85 ||
            registroServidoresUltimo[j].disco > 85)
        ) {
          cardServidor.classList = "kpi kpiCritico";
          cardServidor.innerHTML = `
            <h4>Servidor: ${servidor.nome}</h4>
            <h4>Servidor: ${servidor.tipo}</h4>
            <p>CPU: ${registroServidoresUltimo[j].cpu}%</p>
            <p>RAM: ${registroServidoresUltimo[j].ram}%</p>
            <p>Disco: ${registroServidoresUltimo[j].disco}%</p>
            `;
        } else if (
          (situacaoServidor == "alerta" || situacaoServidor == "Todos") &&
          ((registroServidoresUltimo[j].cpu > 75 &&
            registroServidoresUltimo[j].cpu <= 85) ||
            (registroServidoresUltimo[j].ram > 75 &&
              registroServidoresUltimo[j].ram <= 85) ||
            (registroServidoresUltimo[j].disco > 75 &&
              registroServidoresUltimo[j].cpu <= 85)) &&
          registroServidoresUltimo[j].cpu <= 85 &&
          registroServidoresUltimo[j].ram <= 85 &&
          registroServidoresUltimo[j].disco <= 85
        ) {
          cardServidor.classList = "kpi kpiAlerta";
          cardServidor.innerHTML = `
            <h4>Servidor: ${servidor.nome}</h4>
            <h4>Servidor: ${servidor.tipo}</h4>
            <p>CPU: ${registroServidoresUltimo[j].cpu}%</p>
            <p>RAM: ${registroServidoresUltimo[j].ram}%</p>
            <p>Disco: ${registroServidoresUltimo[j].disco}%</p>
            `;
        } else if (
          (situacaoServidor == "ok" || situacaoServidor == "Todos") &&
          registroServidoresUltimo[j].cpu < 75 &&
          registroServidoresUltimo[j].ram < 75 &&
          registroServidoresUltimo[j].disco < 75
        ) {
          cardServidor.classList = "kpi kpiOk";
          cardServidor.innerHTML = `
            <h4>Servidor: ${servidor.nome}</h4>
            <h4>Servidor: ${servidor.tipo}</h4>
            <p>CPU: ${registroServidoresUltimo[j].cpu}%</p>
            <p>RAM: ${registroServidoresUltimo[j].ram}%</p>
            <p>Disco: ${registroServidoresUltimo[j].disco}%</p>
            `;
        }

        break;
      }
    }

    trilhaCarrossel.appendChild(cardServidor);
  }
  prepararCarrossel();
}

/* Pegar data e hora */
function atualizarDataHora() {
  const agora = new Date();
  const dataHoraFormatada = agora.toLocaleString("pt-BR"); // horario e data brasileiros
  document.getElementById("dataHora").textContent = dataHoraFormatada;
}

atualizarDataHora();

/* Função para fazer carrossel dinâmico */

function prepararCarrossel() {
  // feito pelo chat para visualizacao, logo sera trocado
  const track = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  const kpis = Array.from(track.children);
  const kpiMargin = 20; // margin horizontal (10px de cada lado)
  let kpiWidth = kpis[0].getBoundingClientRect().width + kpiMargin;
  let currentIndex = 0;
  // clonar primeiro e último para looping infinito
  const firstClone = kpis[0].cloneNode(true);
  const lastClone = kpis[kpis.length - 1].cloneNode(true);
  track.appendChild(firstClone);
  track.insertBefore(lastClone, kpis[0]);

  const allKpis = Array.from(track.children);
  currentIndex = 1; // começa no primeiro original
  track.style.transform = `translateX(-${currentIndex * kpiWidth}px)`;

  prevBtn.addEventListener("click", () => moveToIndex(currentIndex - 1));
  nextBtn.addEventListener("click", () => moveToIndex(currentIndex + 1));

  window.addEventListener("resize", () => {
    kpiWidth = allKpis[0].getBoundingClientRect().width + kpiMargin;
    track.style.transition = "none";
    track.style.transform = `translateX(-${currentIndex * kpiWidth}px)`;
  });
  function moveToIndex(index) {
    track.style.transition = "transform 0.5s ease";
    track.style.transform = `translateX(-${index * kpiWidth}px)`;
    currentIndex = index;

    // depois da transição, ajustar se estamos nos clones
    track.addEventListener(
      "transitionend",
      () => {
        if (allKpis[currentIndex] === firstClone) {
          track.style.transition = "none";
          currentIndex = 1;
          track.style.transform = `translateX(-${currentIndex * kpiWidth}px)`;
        }
        if (allKpis[currentIndex] === lastClone) {
          track.style.transition = "none";
          currentIndex = allKpis.length - 2;
          track.style.transform = `translateX(-${currentIndex * kpiWidth}px)`;
        }
      },
      { once: true }
    );
  }
}
