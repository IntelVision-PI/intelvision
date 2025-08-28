const edit_name_local = document.getElementById("edit_name");
const out_edit_name_local = document.getElementById('out_edit_name');
const close_edit_name_button_local = document.getElementById('close_edit_name_button');
const edit_name_modal_local = document.getElementById('edit_name_modal');
const cancel_button_edit_local_name = document.getElementById('cancel_button_edit_name');

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

edit_name_local.addEventListener('click', open_modal_name)

out_edit_name_local.addEventListener('click', close_modal_name)
close_edit_name_button_local.addEventListener('click', close_modal_name)
cancel_button_edit_local_name.addEventListener('click', close_modal_name)