const create_user_button_empresa = document.getElementById('create_user_button_empresa');
const out_create_user = document.getElementById('out_create_user');
const create_user_modal = document.getElementById('create_user_modal');
const close_create_user_button = document.getElementById('close_create_user_button');
const cancel_button_create_user = document.getElementById('cancel_button_create_user');
const view_password_new_create = document.getElementById('view_password_new_create');

const open_modal_create_user = () => {
    out_create_user.style.visibility = 'visible';
    create_user_modal.style.visibility = 'visible';
    out_create_user.style.pointerEvents = 'auto';
    create_user_modal.style.pointerEvents = 'auto';
    out_create_user.style.opacity = 1;
    create_user_modal.style.opacity = 1;
}

const close_modal_create_user = () => {
    out_create_user.style.visibility = 'hidden';
    create_user_modal.style.visibility = 'hidden';
    out_create_user.style.pointerEvents = 'none';
    create_user_modal.style.pointerEvents = 'none';
    out_create_user.style.opacity = 0;
    create_user_modal.style.opacity = 0;
}

view_password_new_create.addEventListener('click', () => {
    view_password(view_password_new_create)
})

close_create_user_button.addEventListener('click', close_modal_create_user);
out_create_user.addEventListener('click', close_modal_create_user);
cancel_button_create_user.addEventListener('click', close_modal_create_user);
create_user_button_empresa.addEventListener('click', open_modal_create_user);