function validarSessaoAdministrador() {
  var perfil = sessionStorage.perfil;

  console.log(perfil);

  if (perfil == "empresaComum") {
    document.getElementById("btn-nav-admin-usuarios").style.display = "none";
    document.getElementById("btn-nav-admin-servidores").style.display = "none";
  }
}
