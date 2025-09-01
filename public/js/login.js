const view_password = document.getElementById('view_password');
const login_button_page = document.getElementById('login_button_page');

view_password.addEventListener('click', () => {
    if (view_password.parentElement.getElementsByTagName('input')[0].type == "password") {
        view_password.parentElement.getElementsByTagName('input')[0].type = "text";
        view_password.innerText = "visibility_off"
    } else {
        view_password.parentElement.getElementsByTagName('input')[0].type = "password";
        view_password.innerText = "visibility"
    }
})

login_button_page.addEventListener('click', () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    if (verifyFields([email, password])) {
        fetch('/usuarios/autenticar', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "email": email.value,
                "senha": password.value
            }),
        }).then(response => {
            if (response.status == 403) {
                fetch('/empresas/autenticar', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "email": email.value,
                        "senha": password.value
                    }),
                }).then(responseEmpresa => {
                    if(responseEmpresa.status == 403){
                        password.insertAdjacentHTML('afterend', '<span style="color: #f00; text-align: center; font-size: 12px">Email ou senha inválido</span>')
                    }else{
                        responseEmpresa.json().then(json => {
                            sessionStorage.setItem('nome', json.nome);
                            sessionStorage.setItem('email', json.email);
                            sessionStorage.setItem('id', json.id);
                            sessionStorage.setItem('codEmpresa', json.codigo)
                            sessionStorage.setItem('type', "empresa");
    
                            window.location.href = "empresa-profile.html"
                        })
                    }
                })
            } else {
                response.json().then(json => {
                    sessionStorage.setItem('nome', json.nome);
                    sessionStorage.setItem('email', json.email);
                    sessionStorage.setItem('id', json.id);
                    sessionStorage.setItem('fkEmpresa', json.empresaId);
                    sessionStorage.setItem('type', "usuario");

                    window.location.href = "user-profile.html"
                })
            }
        })
    }
})