function loadInfosEmpresa(){
    const nome_empresa_local = document.getElementById('nome_empresa');
    const nome_empresa_edit_local = document.getElementById('nome_empresa_edit');
    const codigo_empresa_local = document.getElementById('codigo_empresa');
    const email_empresa_edit = document.getElementById('email_empresa_edit');

    nome_empresa_local.innerHTML = sessionStorage.getItem('nome');
    nome_empresa_edit_local.innerHTML = sessionStorage.getItem('nome');
    codigo_empresa_local.innerHTML = "Código: "+sessionStorage.getItem('codEmpresa');
    email_empresa_edit.innerHTML = sessionStorage.getItem('email');
    
}