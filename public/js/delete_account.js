const delete_account_local = document.getElementById("delete_account");
const out_delete_account_local = document.getElementById('out_delete_account');
const close_delete_account_button_local = document.getElementById('close_delete_account_button');
const delete_account_modal_local = document.getElementById('delete_account_modal');
const cancel_button_delete_local = document.getElementById('cancel_button_delete_account');

const close_modal_delete = () => {
    out_delete_account_local.style.visibility = 'hidden';
    delete_account_modal_local.style.visibility = 'hidden';
    out_delete_account_local.style.pointerEvents = 'none';
    delete_account_modal_local.style.pointerEvents = 'none';
    out_delete_account_local.style.opacity = 0;
    delete_account_modal_local.style.opacity = 0;
}

const open_modal_delete = () => {
    out_delete_account_local.style.visibility = 'visible';
    delete_account_modal_local.style.visibility = 'visible';
    out_delete_account_local.style.pointerEvents = 'auto';
    delete_account_modal_local.style.pointerEvents = 'auto';
    out_delete_account_local.style.opacity = 1;
    delete_account_modal_local.style.opacity = 1;
}

delete_account_local.addEventListener('click', open_modal_delete)

out_delete_account_local.addEventListener('click', close_modal_delete)
close_delete_account_button_local.addEventListener('click', close_modal_delete)
cancel_button_delete_local.addEventListener('click', close_modal_delete)