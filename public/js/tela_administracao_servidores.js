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
          <td class="colunaConfiguracaoServidor">
            <span onclick="open_modal_user(${servidor.id})">
                <i class="fa-solid fa-pen-to-square"></i>
            </span>
          </td>
          <td class="colunaListaUsuariosServidor">
          <span onclick="open_modal_user(${servidor.id})">
                <i class="fa-solid fa-pen-to-square"></i>
            </span>
          </td>
         
      `;

    if (i % 2 == 0) {
      tr.style.backgroundColor = "#B7E4C7";
    } else {
      tr.style.backgroundColor = "transparent";
    }

    tbodyServidores.appendChild(tr);
  }
}
