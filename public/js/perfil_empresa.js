function loadInfosEmpresa() {
    const nome_empresa_local = document.getElementById('nome_empresa');
    const nome_empresa_edit_local = document.getElementById('nome_empresa_edit');
    const codigo_empresa_local = document.getElementById('codigo_empresa');
    const email_empresa_edit = document.getElementById('email_empresa_edit');

    nome_empresa_local.innerHTML = sessionStorage.getItem('nome');
    nome_empresa_edit_local.innerHTML = sessionStorage.getItem('nome');
    codigo_empresa_local.innerHTML = "Código: " + sessionStorage.getItem('codEmpresa');
    email_empresa_edit.innerHTML = sessionStorage.getItem('email');

}


function getUsersEmpresa() {
    fetch('/empresas/select/usuario/' + sessionStorage.getItem('id'))
        .then(response => {
            response.json()
                .then(json => {
                    const users_container = document.getElementById('users_container');
                    for (user of json) {
                        users_container.innerHTML += `
                            <div class="user" idUser="${user.id}">
                                <div class="photo_info">
                                    <div class="photo">
                                        <img src="assets/profile/default_avatar.webp">
                                    </div>
                                    <div class="user_info">
                                        <p>${user.nome}</p>
                                        <span>Suporte técnico na Intelbras</span>
                                    </div>
                                </div>
                                <div class="user_email">
                                    ${user.email}
                                </div>
                                <div class="user_controls">
                                    <div class="edit_user_button" onclick="onclickEdit(this)">
                                        <span class="material-symbols-outlined">
                                            person_edit
                                        </span>
                                    </div>
                                    <div class="delete_user_button" onclick="onclickDeleteUser(this)">
                                        <span class="material-symbols-outlined">
                                            delete
                                        </span>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                })
        })
}