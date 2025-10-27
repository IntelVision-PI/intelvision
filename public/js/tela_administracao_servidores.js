let servidores = [];
let servidorSelecionado = null; // Id servidor selecionado

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

/* Parte da administraçao servidor */

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
  const tbodyServidores = document.getElementById("tbody_servidores");
  tbodyServidores.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    const servidor = data[i];
    const tr = document.createElement("tr");

    // <td class="colunaStatusServidor">${servidor.atividade}</td>
    tr.innerHTML = `
          <td class="colunaNomeServidor">${servidor.nome}</td>
          <td class="colunaTipoServidor">${servidor.tipo}</td>
          <td class="colunaStatusServidor">Ativo</td>
          <td class="colunaConfiguracaoServidor">
            <span onclick="open_modal_configuracaoServidor(${servidor.id})">
                <i class="fa-solid fa-gears"></i>
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

/* Parte de editar servidor */

let idModalServidorSelecionado;
let out_edit_configuracaoServidor_local = document.getElementById(
  "out_edit_configuracaoServidor"
);
let close_edit_configuracaoServidor_button_local = document.getElementById(
  "close_edit_configuracaoServidor_button"
);
let edit_configuracaoServidor_modal_local = document.getElementById(
  "edit_configuracaoServidor_modal"
);

const close_modal_configuracaoServidor = () => {
  out_edit_configuracaoServidor_local.style.visibility = "hidden";
  edit_configuracaoServidor_modal_local.style.visibility = "hidden";
  out_edit_configuracaoServidor_local.style.pointerEvents = "none";
  edit_configuracaoServidor_modal_local.style.pointerEvents = "none";
  out_edit_configuracaoServidor_local.style.opacity = 0;
  edit_configuracaoServidor_modal_local.style.opacity = 0;
};

const open_modal_configuracaoServidor = (numero) => {
  idModalSelecionado = Number(numero);
  console.log("id do modal selecionado: " + idModalSelecionado);
  out_edit_configuracaoServidor_local.style.visibility = "visible";
  edit_configuracaoServidor_modal_local.style.visibility = "visible";
  out_edit_configuracaoServidor_local.style.pointerEvents = "auto";
  edit_configuracaoServidor_modal_local.style.pointerEvents = "auto";
  out_edit_configuracaoServidor_local.style.opacity = 1;
  edit_configuracaoServidor_modal_local.style.opacity = 1;
};

out_edit_configuracaoServidor_local.addEventListener(
  "click",
  close_modal_configuracaoServidor
);
close_edit_configuracaoServidor_button_local.addEventListener(
  "click",
  close_modal_configuracaoServidor
);

/* Parte de editar servidor - Aplicativos */

let out_edit_configuracaoServidorAplicativos_local = document.getElementById(
  "out_edit_configuracaoServidorAplicativos"
);
let close_edit_configuracaoServidorAplicativos_button_local =
  document.getElementById("close_edit_configuracaoServidorAplicativos_button");
let edit_configuracaoServidorAplicativos_modal_local = document.getElementById(
  "edit_configuracaoServidorAplicativos_modal"
);

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
  console.log("id do modal selecionado: " + idModalSelecionado);
  out_edit_configuracaoServidorAplicativos_local.style.visibility = "visible";
  edit_configuracaoServidorAplicativos_modal_local.style.visibility = "visible";
  out_edit_configuracaoServidorAplicativos_local.style.pointerEvents = "auto";
  edit_configuracaoServidorAplicativos_modal_local.style.pointerEvents = "auto";
  out_edit_configuracaoServidorAplicativos_local.style.opacity = 1;
  edit_configuracaoServidorAplicativos_modal_local.style.opacity = 1;
};

out_edit_configuracaoServidorAplicativos_local.addEventListener(
  "click",
  close_modal_configuracaoServidorAplicativos
);
close_edit_configuracaoServidorAplicativos_button_local.addEventListener(
  "click",
  close_modal_configuracaoServidorAplicativos
);
