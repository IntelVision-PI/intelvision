let servidores = [];

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
  /* Essa função puxa os dados de usuários do banco de dados */
  console.log("Me chamou puxarServidores(Dados)");
  const idEmpresa = Number(sessionStorage.fkEmpresa);
  console.log(idEmpresa);

  fetch(`/empresas/select/servidor/${idEmpresa}`, {
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

/* edit_configuracaoServidor_local.addEventListener("click", open_modal_configuracaoServidor); */
out_edit_configuracaoServidor_local.addEventListener(
  "click",
  close_modal_configuracaoServidor
);
close_edit_configuracaoServidor_button_local.addEventListener(
  "click",
  close_modal_configuracaoServidor
);
