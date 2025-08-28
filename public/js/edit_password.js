const edit_password_local = document.getElementById("edit_password");
const out_edit_password_local = document.getElementById('out_edit_password');
const close_edit_password_button_local = document.getElementById('close_edit_password_button');
const edit_password_modal_local = document.getElementById('edit_password_modal');
const cancel_button_editpassword_local = document.getElementById('cancel_button_edit_password');

const close_password_modal = () => {
    out_edit_password_local.style.visibility = 'hidden';
    edit_password_modal_local.style.visibility = 'hidden';
    out_edit_password_local.style.pointerEvents = 'none';
    edit_password_modal_local.style.pointerEvents = 'none';
    out_edit_password_local.style.opacity = 0;
    edit_password_modal_local.style.opacity = 0;
}

const open_password_modal = () => {
    out_edit_password_local.style.visibility = 'visible';
    edit_password_modal_local.style.visibility = 'visible';
    out_edit_password_local.style.pointerEvents = 'auto';
    edit_password_modal_local.style.pointerEvents = 'auto';
    out_edit_password_local.style.opacity = 1;
    edit_password_modal_local.style.opacity = 1;
}

const view_password = (local) => {
    if (local.parentElement.getElementsByTagName('input')[0].type == "password") {
        local.parentElement.getElementsByTagName('input')[0].type = "text";
        local.innerText = "visibility_off"
    } else {
        local.parentElement.getElementsByTagName('input')[0].type = "password";
        local.innerText = "visibility"
    }
}

const view_password_current = document.getElementById('view_password_current');
const view_password_new = document.getElementById('view_password_new');

view_password_current.addEventListener('click', () => {
    view_password(view_password_current)
})

view_password_new.addEventListener('click', () => {
    view_password(view_password_new)
})

edit_password_local.addEventListener('click', open_password_modal)

out_edit_password_local.addEventListener('click', close_password_modal)
close_edit_password_button_local.addEventListener('click', close_password_modal)
cancel_button_editpassword_local.addEventListener('click', close_password_modal)