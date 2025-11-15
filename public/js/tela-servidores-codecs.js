const ctxDia = document.getElementById("requisicoesDia");

let servidores = [];
let servidoresProcessamento = [];

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
              <td>Disco</td>
              <td>1TB</td>
            </tr>
            <tr>
              <td>Memória</td>
              <td>64GB</td>
            </tr>
            <tr>
              <td>CPU</td>
              <td>Intel Xeon CPU Max 9462 2,70 GHz</td>
            </tr>
            <tr>
              <td>CODEC</td>
              <td>H.264</td>
            </tr>
          `;
          break;
        }
      }
    }
  }, 1000);
}

new Chart(ctxDia, {
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
});

// Gráfico de Requisições por hora
const ctxHora = document.getElementById("requisicoesHora");
new Chart(ctxHora, {
  type: "line",
  data: {
    labels: ["00-04", "04-08", "08-12", "12-16", "16-20", "20-24"],
    datasets: [
      {
        label: "Requisições",
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
});
