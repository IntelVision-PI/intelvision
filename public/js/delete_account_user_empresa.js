const out_delete_user_account = document.getElementById('out_delete_user_account');
const close_delete_user_account_button = document.getElementById('close_delete_user_account_button');
const delete_user_account_modal = document.getElementById('delete_user_account_modal');
const cancel_button_delete_user_account = document.getElementById('cancel_button_delete_user_account');

const delete_user_button = document.getElementsByClassName('delete_user_button');

const close_modal_delete_user = () => {
    out_delete_user_account.style.visibility = 'hidden';
    delete_user_account_modal.style.visibility = 'hidden';
    out_delete_user_account.style.pointerEvents = 'none';
    delete_user_account_modal.style.pointerEvents = 'none';
    out_delete_user_account.style.opacity = 0;
    delete_user_account_modal.style.opacity = 0;
}

const open_modal_delete_user = () => {
    out_delete_user_account.style.visibility = 'visible';
    delete_user_account_modal.style.visibility = 'visible';
    out_delete_user_account.style.pointerEvents = 'auto';
    delete_user_account_modal.style.pointerEvents = 'auto';
    out_delete_user_account.style.opacity = 1;
    delete_user_account_modal.style.opacity = 1;
}

for(delete_button of delete_user_button){
    delete_button.addEventListener('click', (e) => {
        const userLocal = e.target.parentElement.parentElement.parentElement;
        const userIdDeleted = userLocal.getAttribute('idUser');

        open_modal_delete_user()
    })
}

out_delete_user_account.addEventListener('click', close_modal_delete_user)
close_delete_user_account_button.addEventListener('click', close_modal_delete_user)
cancel_button_delete_user_account.addEventListener('click', close_modal_delete_user)