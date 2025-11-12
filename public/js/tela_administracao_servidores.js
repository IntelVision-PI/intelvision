let servidores = [];
let servidorSelecionado = null;

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

function puxarDadosServidor() {
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
  const tbodyServidores = document.getElementById("tbody_servidores");
  tbodyServidores.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    const servidor = data[i];
    const tr = document.createElement("tr");

    tr.innerHTML = `
          <td class="colunaNomeServidor">${servidor.nome}</td>
          <td class="colunaTipoServidor">${servidor.tipo}</td>
          <td class="colunaStatusServidor">Ativo</td>
          <td class="colunaConfiguracaoServidor">
            <span onclick="open_modal_configuracaoServidor(${servidor.id})">
                <i class="fa-solid fa-gears"></i>
            </span>
          </td>
          
          <td class="colunaConfiguracaoComponente">
            <span class="material-symbols-outlined" onclick="open_modal_componente(${servidor.id}, '${servidor.nome}')">
                tune
            </span>
          </td>
        `;

    if (servidor.nome == 0) {
      tr.style.backgroundColor = "yellow";
    } else {
      if (i % 2 == 0) {
        tr.style.backgroundColor = "#B7E4C7";
      } else {
        tr.style.backgroundColor = "transparent";
      }
    }

    tbodyServidores.appendChild(tr);
  }
}

function buscarNomeServidor(nome) {
  console.log("Me chamou buscarNomeServidor(nome)");

  if (nome == "") {
    puxarDadosServidor();
    return;
  }

  console.log(servidores);
  let dadosFiltroNome = [];
  for (let i = 0; i < servidores.length; i++) {
    if (
      servidores[i].nome
        .replace(" ", "")
        .toLowerCase()
        .includes(nome.replace(" ", "").toLowerCase())
    ) {
      dadosFiltroNome.push(servidores[i]);
    }
  }
  console.log("Dados filtrados por nome: ");
  console.log(dadosFiltroNome);

  const tbody = document.getElementById("tbody_servidores");
  tbody.innerHTML = "";

  for (let i = 0; i < dadosFiltroNome.length; i++) {
    const servidor = dadosFiltroNome[i];
    const tr = document.createElement("tr");

    tr.innerHTML = `
          <td class="colunaNomeServidor">${servidor.nome}</td>
          <td class="colunaTipoServidor">${servidor.tipo}</td>
          <td class="colunaStatusServidor">Ativo</td>
          <td class="colunaConfiguracaoServidor">
            <span onclick="open_modal_configuracaoServidor(${servidor.id})">
                <i class="fa-solid fa-gears"></i>
            </span>
          </td>
          
          <td class="colunaConfiguracaoComponente">
            <span class="material-symbols-outlined" onclick="open_modal_componente(${servidor.id}, '${servidor.nome}')">
                tune
            </span>
          </td>
        `;

    if (servidor.nome == 0) {
      tr.style.backgroundColor = "yellow";
    } else {
      if (i % 2 == 0) {
        tr.style.backgroundColor = "#B7E4C7";
      } else {
        tr.style.backgroundColor = "transparent";
      }
    }
    tbody.appendChild(tr);
  }
}

function selecionarTipo() {
  console.log("Me chamou selecionarTipo");
  let tipoSelecionado = select_tipo.value;
  console.log(Number(tipoSelecionado));

  if (tipoSelecionado == "Todos") {
    puxarDadosServidor();
    return;
  }

  const tbody = document.getElementById("tbody_servidores");
  tbody.innerHTML = "";

  for (let i = 0; i < servidores.length; i++) {
    const servidor = servidores[i];
    const tr = document.createElement("tr");

    if (servidor.tipo == tipoSelecionado) {
      tr.innerHTML = `
            <td class="colunaNomeServidor">${servidor.nome}</td>
            <td class="colunaTipoServidor">${servidor.tipo}</td>
            <td class="colunaStatusServidor">Ativo</td>
            <td class="colunaConfiguracaoServidor">
              <span onclick="open_modal_configuracaoServidor(${servidor.id})">
                  <i class="fa-solid fa-gears"></i>
              </span>
            </td>

            <td class="colunaConfiguracaoComponente">
              <span class="material-symbols-outlined" onclick="open_modal_componente(${servidor.id}, '${servidor.nome}')">
                  tune
              </span>
            </td>
          `;

      if (servidor.nome == 0) {
        tr.style.backgroundColor = "yellow";
      } else {
        if (i % 2 == 0) {
          tr.style.backgroundColor = "#B7E4C7";
        } else {
          tr.style.backgroundColor = "transparent";
        }
      }
      tbody.appendChild(tr);
    }
  }
}


let idModalServidorSelecionado;
let out_edit_configuracaoServidor_local = document.getElementById("out_edit_configuracaoServidor");
let close_edit_configuracaoServidor_button_local = document.getElementById("close_edit_configuracaoServidor_button");
let edit_configuracaoServidor_modal_local = document.getElementById("edit_configuracaoServidor_modal");

const close_modal_configuracaoServidor = () => {
  out_edit_configuracaoServidor_local.style.visibility = "hidden";
  edit_configuracaoServidor_modal_local.style.visibility = "hidden";
  out_edit_configuracaoServidor_local.style.pointerEvents = "none";
  edit_configuracaoServidor_modal_local.style.pointerEvents = "none";
  out_edit_configuracaoServidor_local.style.opacity = 0;
  edit_configuracaoServidor_modal_local.style.opacity = 0;
};

const open_modal_configuracaoServidor = (idServidor) => {
  idModalSelecionado = Number(idServidor);
  console.log("id do modal selecionado: " + idModalSelecionado);

  out_edit_configuracaoServidor_local.style.visibility = "visible";
  edit_configuracaoServidor_modal_local.style.visibility = "visible";
  out_edit_configuracaoServidor_local.style.pointerEvents = "auto";
  edit_configuracaoServidor_modal_local.style.pointerEvents = "auto";
  out_edit_configuracaoServidor_local.style.opacity = 1;
  edit_configuracaoServidor_modal_local.style.opacity = 1;

  fetch(`/servidores/buscar/${idServidor}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  }).then(resposta => {
    if (resposta.ok) {
      resposta.json().then(json => {
        const dados = json[0];
        document.getElementById("ipt_id_servidor_edit").value = dados.id;
        document.getElementById("ipt_edit_nome").value = dados.nome;
        document.getElementById("ipt_edit_modelo").value = dados.modelo;
        document.getElementById("ipt_edit_so").value = dados.sistema_operacional;
        document.getElementById("select_edit_tipo").value = dados.tipo;
        document.getElementById("ipt_edit_tag").value = dados.service_tag;
        document.getElementById("ipt_edit_mac").value = dados.macaddress;
      });
    } else {
      alert("Erro ao buscar dados do servidor!");
    }
  });
};

function salvarEdicaoServidor() {
    const idServidor = document.getElementById("ipt_id_servidor_edit").value;
    const nome = document.getElementById("ipt_edit_nome").value;
    const modelo = document.getElementById("ipt_edit_modelo").value;
    const so = document.getElementById("ipt_edit_so").value;
    const tipo = document.getElementById("select_edit_tipo").value;

    fetch(`/servidores/atualizar/${idServidor}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, modelo, so, tipo })
    }).then(resposta => {
        if (resposta.ok) {
            alert("Servidor atualizado com sucesso!");
            close_modal_configuracaoServidor();
            puxarDadosServidor();
        } else {
            alert("Erro ao atualizar servidor!");
        }
    });
}

out_edit_configuracaoServidor_local.addEventListener("click", close_modal_configuracaoServidor);
close_edit_configuracaoServidor_button_local.addEventListener("click", close_modal_configuracaoServidor);

let out_edit_configuracaoServidorAplicativos_local = document.getElementById("out_edit_configuracaoServidorAplicativos");
let close_edit_configuracaoServidorAplicativos_button_local = document.getElementById("close_edit_configuracaoServidorAplicativos_button");
let edit_configuracaoServidorAplicativos_modal_local = document.getElementById("edit_configuracaoServidorAplicativos_modal");

const close_modal_configuracaoServidorAplicativos = () => {
  out_edit_configuracaoServidorAplicativos_local.style.visibility = "hidden";
  edit_configuracaoServidorAplicativos_modal_local.style.visibility = "hidden";
  out_edit_configuracaoServidorAplicativos_local.style.pointerEvents = "none";
  edit_configuracaoServidorAplicativos_modal_local.style.pointerEvents = "none";
  out_edit_configuracaoServidorAplicativos_local.style.opacity = 0;
  edit_configuracaoServidorAplicativos_modal_local.style.opacity = 0;
};

const open_modal_configuracaoServidorAplicativos = (numero) => {
  idModalSelecionado = Number(numero);
  out_edit_configuracaoServidorAplicativos_local.style.visibility = "visible";
  edit_configuracaoServidorAplicativos_modal_local.style.visibility = "visible";
  out_edit_configuracaoServidorAplicativos_local.style.pointerEvents = "auto";
  edit_configuracaoServidorAplicativos_modal_local.style.pointerEvents = "auto";
  out_edit_configuracaoServidorAplicativos_local.style.opacity = 1;
  edit_configuracaoServidorAplicativos_modal_local.style.opacity = 1;
};

out_edit_configuracaoServidorAplicativos_local.addEventListener("click", close_modal_configuracaoServidorAplicativos);
close_edit_configuracaoServidorAplicativos_button_local.addEventListener("click", close_modal_configuracaoServidorAplicativos);


const outEditComponente = document.getElementById("out_edit_componente");
const modalEditComponente = document.getElementById("edit_componente_modal");
const closeBtnComponente = document.getElementById("close_edit_componente_button");
const cancelBtnComponente = document.getElementById("cancel_edit_componente_button");
const iptServidorId = document.getElementById("ipt_componente_servidor_id");
const modalTitle = document.getElementById("componente_modal_title");

function open_modal_componente(idServidor, nomeServidor) {
  console.log(`Abrindo modal de componentes para o servidor ID: ${idServidor}`);
  iptServidorId.value = idServidor;
  modalTitle.innerHTML = `Parâmetros - ${nomeServidor}`;

  outEditComponente.style.visibility = "visible";
  outEditComponente.style.opacity = 1;
  outEditComponente.style.pointerEvents = "all";
  modalEditComponente.style.visibility = "visible";
  modalEditComponente.style.opacity = 1;
  modalEditComponente.style.pointerEvents = "all";

  fetchComponenteData(idServidor);
}

function close_modal_componente() {
  outEditComponente.style.visibility = "hidden";
  outEditComponente.style.opacity = 0;
  outEditComponente.style.pointerEvents = "none";
  modalEditComponente.style.visibility = "hidden";
  modalEditComponente.style.opacity = 0;
  modalEditComponente.style.pointerEvents = "none";
  iptServidorId.value = "";
  
  const inputs = modalEditComponente.querySelectorAll("input[type='number']");
  inputs.forEach(input => input.value = "");
}

function fetchComponenteData(idServidor) {
  console.log(`Buscando parâmetros reais para o ID: ${idServidor}`);
  
  fetch(`/servidores/buscarParametros/${idServidor}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  }).then(resposta => {
    if (resposta.ok) {
      resposta.json().then(dados => {
        dados.forEach(item => {
          if (item.componente === 'CPU') {
            document.getElementById("ipt_cpu_risco_min").value = item.em_risco_min;
            document.getElementById("ipt_cpu_alerta").value = item.alerta;
            document.getElementById("ipt_cpu_risco_max").value = item.em_risco_max;
          } 
          else if (item.componente === 'RAM') {
            document.getElementById("ipt_ram_risco_min").value = item.em_risco_min;
            document.getElementById("ipt_ram_alerta").value = item.alerta;
            document.getElementById("ipt_ram_risco_max").value = item.em_risco_max;
          } 
          else if (item.componente === 'Disco') {
            document.getElementById("ipt_disco_risco_min").value = item.em_risco_min;
            document.getElementById("ipt_disco_alerta").value = item.alerta;
            document.getElementById("ipt_disco_risco_max").value = item.em_risco_max;
          }
        });
      });
    } else if (resposta.status == 204) {
       console.log("Nenhum parâmetro configurado ainda.");
    }
  });
}

function updateComponenteData() {
  const idServidor = document.getElementById("ipt_componente_servidor_id").value;
  
  const dadosAtualizados = {
    cpu_risco_min: document.getElementById("ipt_cpu_risco_min").value,
    cpu_alerta: document.getElementById("ipt_cpu_alerta").value,
    cpu_risco_max: document.getElementById("ipt_cpu_risco_max").value,
    
    ram_risco_min: document.getElementById("ipt_ram_risco_min").value,
    ram_alerta: document.getElementById("ipt_ram_alerta").value,
    ram_risco_max: document.getElementById("ipt_ram_risco_max").value,

    disco_risco_min: document.getElementById("ipt_disco_risco_min").value,
    disco_alerta: document.getElementById("ipt_disco_alerta").value,
    disco_risco_max: document.getElementById("ipt_disco_risco_max").value
  };

  console.log("Enviando atualização...", dadosAtualizados);

  fetch(`/servidores/atualizarParametros/${idServidor}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosAtualizados)
  }).then(resposta => {
    if (resposta.ok) {
      alert("Parâmetros atualizados com sucesso!");
      close_modal_componente();
    } else {
      resposta.text().then(texto => {
        alert("Erro ao atualizar: " + texto);
      });
    }
  }).catch(erro => {
    console.error("Erro na requisição: ", erro);
  });
}

closeBtnComponente.addEventListener("click", close_modal_componente);
cancelBtnComponente.addEventListener("click", close_modal_componente);
outEditComponente.addEventListener("click", close_modal_componente);