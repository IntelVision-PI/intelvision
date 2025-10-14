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
let hospitais = [];
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

function alterarAcesso(index) {
  const usuario = usuarios[index];
  const novoStatus =
    usuario.statusUser.toLowerCase() === "ativo" ? "inativo" : "ativo";

  fetch(`/contas/alterarAcesso/${usuario.id_usuario}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ statusUser: novoStatus }),
  })
    .then((res) => res.json())
    .then(() => {
      usuarios[index].statusUser = novoStatus;
      listar(usuarios);
    })
    .catch((err) => console.error(err));
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
                  <span>
                    <i class="fa-solid fa-user-pen"></i>
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
                  <span>
                    <i class="fa-solid fa-user-pen"></i>
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
                  <span>
                    <i class="fa-solid fa-user-pen"></i>
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
