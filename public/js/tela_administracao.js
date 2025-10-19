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

let usuarios = [];
let servidores = [];
let usuarioSelecionado = null; // Id usuário

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

function deletarr(id) {
  usuarioSelecionado = id;
  var divAlerta = document.getElementById("divAlerta");
  divAlerta.style.display = "flex";
}

function fecharAlerta() {
  var divAlerta = document.getElementById("divAlerta");
  divAlerta.style.display = "none";
}

function deletar(id) {
  if (!id) {
    return;
  }

  console.log("Me chamou deletar(id)", id);
  fetch(`/contas/deleteConta/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then(() => {
      puxarDados();
      fecharAlerta();
    })
    .catch((err) => console.error(err));
}

function puxarDados() {
  /* Essa função puxa os dados de usuários do banco de dados */
  console.log("Me chamou puxar(Dados)");
  const idEmpresa = Number(sessionStorage.fkEmpresa);
  console.log(idEmpresa);

  fetch(`/empresas/select/usuario/${idEmpresa}`, {
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
      listar(data);
    });
}

function listar(data) {
  console.log("Me chamou listar(data)");
  console.log(data);
  usuarios = data;
  const tbody = document.getElementById("tbody_usuarios");
  tbody.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    const usuario = data[i];
    const tr = document.createElement("tr");

    tr.innerHTML = `
          <td class="colunaRepresentante">${usuario.nome}</td>
                <td class="colunaEmail">${usuario.email}</td>
                <td class="colunaPerfil">${
                  usuario.perfil == "empresaAdmin" ? "Administrador" : "Comum"
                }</td>
                <td class="colunaTipoAcesso">
                  <span onclick="open_modal_user(${usuario.id})">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </span>
                </td>
                <td class="colunaAcesso">${
                  usuario.atividade == "1" ? "Ativo" : "Inativo"
                }</td>
         
      `;

    if (usuario.atividade == 0) {
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

function buscarRepresentante(representante) {
  console.log("Me chamou buscarRepresentante");

  if (representante == "") {
    puxarDados();
    return;
  }

  console.log(usuarios);
  let dadosFiltroRepresentante = [];
  for (let i = 0; i < usuarios.length; i++) {
    if (
      usuarios[i].nome
        .replace(" ", "")
        .toLowerCase()
        .includes(representante.replace(" ", "").toLowerCase())
    ) {
      dadosFiltroRepresentante.push(usuarios[i]);
    }
  }
  console.log("Dados filtrados por representante: ");
  console.log(dadosFiltroRepresentante);

  const tbody = document.getElementById("tbody_usuarios");
  tbody.innerHTML = "";

  for (let i = 0; i < dadosFiltroRepresentante.length; i++) {
    const usuario = dadosFiltroRepresentante[i];
    const tr = document.createElement("tr");

    tr.innerHTML = `
          <td class="colunaRepresentante">${usuario.nome}</td>
                <td class="colunaEmail">${usuario.email}</td>
                <td class="colunaPerfil">${
                  usuario.perfil == "empresaAdmin" ? "Administrador" : "Comum"
                }</td>
                <td class="colunaTipoAcesso">
                  <span onclick="open_modal_user(${usuario.id})">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </span>
                </td>
                <td class="colunaAcesso">${
                  usuario.atividade == "1" ? "Ativo" : "Inativo"
                }</td>
      `;

    if (usuario.atividade == 0) {
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

function selecionarAtividade() {
  console.log("Me chamou selecionarAtividade");
  let atividadeSelecionado = select_atividade.value;
  console.log(Number(atividadeSelecionado));

  if (atividadeSelecionado == "Ambos") {
    puxarDados();
    return;
  }

  const tbody = document.getElementById("tbody_usuarios");
  tbody.innerHTML = "";

  for (let i = 0; i < usuarios.length; i++) {
    const usuario = usuarios[i];
    const tr = document.createElement("tr");

    if (usuario.atividade == Number(atividadeSelecionado)) {
      tr.innerHTML = `
          <td class="colunaRepresentante">${usuario.nome}</td>
                <td class="colunaEmail">${usuario.email}</td>
                <td class="colunaPerfil">${
                  usuario.perfil == "empresaAdmin" ? "Administrador" : "Comum"
                }</td>
                <td class="colunaTipoAcesso">
                  <span onclick="open_modal_user(${usuario.id})">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </span>
                </td>
                <td class="colunaAcesso">${
                  usuario.atividade == "1" ? "Ativo" : "Inativo"
                }</td>
      `;

      if (usuario.atividade == 0) {
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

/* Parte de editar usuario */

/* let edit_user_local = document.getElementsByClassName("edit_user"); */
let idModalSelecionado;
let out_edit_user_local = document.getElementById("out_edit_user");
let close_edit_user_button_local = document.getElementById(
  "close_edit_user_button"
);
let edit_user_modal_local = document.getElementById("edit_user_modal");
let cancel_button_edit_local_user = document.getElementById(
  "cancel_button_edit_user"
);
let submit_button_edit_user_local = document.getElementById(
  "submit_button_edit_user"
);

const close_modal_user = () => {
  out_edit_user_local.style.visibility = "hidden";
  edit_user_modal_local.style.visibility = "hidden";
  out_edit_user_local.style.pointerEvents = "none";
  edit_user_modal_local.style.pointerEvents = "none";
  out_edit_user_local.style.opacity = 0;
  edit_user_modal_local.style.opacity = 0;
};

const open_modal_user = (numero) => {
  idModalSelecionado = Number(numero);
  console.log("id do modal selecionado: " + idModalSelecionado);
  let tituloModal = document.getElementById("tituloModalUsuario");
  let usuarioSelecionado;
  for (i = 0; i < usuarios.length; i++) {
    if (usuarios[i].id == idModalSelecionado) {
      usuarioSelecionado = usuarios[i].nome;
      break;
    }
  }
  tituloModal.innerHTML = `Editar usuário ${usuarioSelecionado}`;
  out_edit_user_local.style.visibility = "visible";
  edit_user_modal_local.style.visibility = "visible";
  out_edit_user_local.style.pointerEvents = "auto";
  edit_user_modal_local.style.pointerEvents = "auto";
  out_edit_user_local.style.opacity = 1;
  edit_user_modal_local.style.opacity = 1;
};

function sendStatus(idUsuario) {
  const statusSelecionado = Number(
    document.querySelector('input[name="statusUsuario"]:checked').value
  );
  console.log("ID do usuario: " + idUsuario);
  fetch(`/usuarios/alterarAtividade/${idUsuario}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ statusUser: statusSelecionado }),
  })
    .then((res) => res.json())
    .then(() => {
      alert(`Atividade do usuário foi alterada com sucesso !`);
      close_modal_user();
      puxarDados();
    })
    .catch((err) => console.error(err));
}

/* edit_user_local.addEventListener("click", open_modal_user); */
out_edit_user_local.addEventListener("click", close_modal_user);
close_edit_user_button_local.addEventListener("click", close_modal_user);
cancel_button_edit_local_user.addEventListener("click", close_modal_user);
/* submit_button_edit_user_local.addEventListener(
  "click",
  sendStatus(idModalSelecionado)
); */
