const nomeServidor = document.getElementById("ipt_nome_servidor");
const sistemaOperacional = document.getElementById("ipt_so");
const macAddress = document.getElementById("ipt_mac");
const tipoServidor = document.getElementById("select_tipo_servidor");
const fkEmpresa = sessionStorage.getItem("fkEmpresa") || sessionStorage.getItem("codEmpresa");
const buttonCadastrarServidor = document.getElementById("submit_cadastro");

buttonCadastrarServidor.addEventListener("click", () => {
    if (verifyFields([nomeServidor, sistemaOperacional, macAddress, tipoServidor])) {
      fetch("/servidores/cadastrarServidor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nomeServidor: nomeServidor.value,
          sistemaOperacional: sistemaOperacional.value,
          macAddress: macAddress.value,
          tipoServidor: tipoServidor.value,
          fkEmpresa: fkEmpresa
          // nota: acho que preciso colocar algo relacionaodo a fkEmpresa aqui, mas não tenho certeza
        }),
      }).then((response) => {
        if (response.status == 403) {
          code.insertAdjacentHTML(
            "afterend",
            '<span style="color: #f00; text-align: center; font-size: 12px">Servidor não cadastrado</span>'
          );
        } else {
          window.location.href = "tela-administracao-servidores.html";
        }
      });
    }
  
});
