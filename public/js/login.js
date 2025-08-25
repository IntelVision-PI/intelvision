const view_password = document.getElementById('view_password');

view_password.addEventListener('click', () => {
    if(view_password.parentElement.getElementsByTagName('input')[0].type == "password"){
        view_password.parentElement.getElementsByTagName('input')[0].type = "text";
        view_password.innerText = "visibility_off"
    }else{
        view_password.parentElement.getElementsByTagName('input')[0].type = "password";
        view_password.innerText = "visibility"
    }
})