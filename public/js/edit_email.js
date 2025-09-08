const edit_email_local = document.getElementById("edit_email");
const out_edit_email_local = document.getElementById('out_edit_email');
const close_edit_email_button_local = document.getElementById('close_edit_email_button');
const edit_email_modal_local = document.getElementById('edit_email_modal');
const cancel_button_edit_local = document.getElementById('cancel_button_edit');
const submit_button_edit_email = document.getElementById('submit_button_edit_email');

const close_modal = () => {
    out_edit_email_local.style.visibility = 'hidden';
    edit_email_modal_local.style.visibility = 'hidden';
    out_edit_email_local.style.pointerEvents = 'none';
    edit_email_modal_local.style.pointerEvents = 'none';
    out_edit_email_local.style.opacity = 0;
    edit_email_modal_local.style.opacity = 0;
}

const open_modal = () => {
    out_edit_email_local.style.visibility = 'visible';
    edit_email_modal_local.style.visibility = 'visible';
    out_edit_email_local.style.pointerEvents = 'auto';
    edit_email_modal_local.style.pointerEvents = 'auto';
    out_edit_email_local.style.opacity = 1;
    edit_email_modal_local.style.opacity = 1;
}

const sendEmail = () => {
    if (sessionStorage.getItem('type') == 'empresa') {
        const email = document.querySelector('.edit_email_content .edit_email_field input').value;

        fetch('empresas/atualizar/empresa/email', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "email": email,
                "idEmpresa": sessionStorage.getItem('id')
            }),
        }).then(response => {
            if (response.status == 200) {
                sessionStorage.setItem('email', email);
                window.location.reload();
            }
        })
    } else if (sessionStorage.getItem('type') == 'usuario') {
        const email = document.querySelector('.edit_email_content .edit_email_field input').value;

        fetch('usuarios/atualizaEmailDoUsuario', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "email": email,
                "id": sessionStorage.getItem('id')
            }),
        }).then(response => {
            if (response.status == 200) {
                sessionStorage.setItem('email', email);
                window.location.reload();
            }
        })
    }
}

edit_email_local.addEventListener('click', open_modal)

out_edit_email_local.addEventListener('click', close_modal)
close_edit_email_button_local.addEventListener('click', close_modal)
cancel_button_edit_local.addEventListener('click', close_modal)
submit_button_edit_email.addEventListener('click', sendEmail)