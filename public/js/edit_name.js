const edit_name_local = document.getElementById("edit_name");
const out_edit_name_local = document.getElementById('out_edit_name');
const close_edit_name_button_local = document.getElementById('close_edit_name_button');
const edit_name_modal_local = document.getElementById('edit_name_modal');
const cancel_button_edit_local_name = document.getElementById('cancel_button_edit_name');
const submit_button_edit_name = document.getElementById('submit_button_edit_name');

const close_modal_name = () => {
    out_edit_name_local.style.visibility = 'hidden';
    edit_name_modal_local.style.visibility = 'hidden';
    out_edit_name_local.style.pointerEvents = 'none';
    edit_name_modal_local.style.pointerEvents = 'none';
    out_edit_name_local.style.opacity = 0;
    edit_name_modal_local.style.opacity = 0;
}

const open_modal_name = () => {
    out_edit_name_local.style.visibility = 'visible';
    edit_name_modal_local.style.visibility = 'visible';
    out_edit_name_local.style.pointerEvents = 'auto';
    edit_name_modal_local.style.pointerEvents = 'auto';
    out_edit_name_local.style.opacity = 1;
    edit_name_modal_local.style.opacity = 1;
}

const sendNameEmpresa = () => {
    const nome = document.querySelector('.edit_name_content .edit_name_field input').value;

    fetch('empresas/atualizar/empresa/nome', {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "nome": nome,
            "idEmpresa": sessionStorage.getItem('id')
        }),
    }).then(response => {
        if (response.status == 200) {
            sessionStorage.setItem('nome', nome);
            window.location.reload();
        }
    })
}

edit_name_local.addEventListener('click', open_modal_name)

out_edit_name_local.addEventListener('click', close_modal_name)
close_edit_name_button_local.addEventListener('click', close_modal_name)
cancel_button_edit_local_name.addEventListener('click', close_modal_name)
submit_button_edit_name.addEventListener('click', sendNameEmpresa)