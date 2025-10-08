const verificarSeUsuarioEstaLogado = () => {
    const localButtons = document.querySelector('nav .buttons_account');
    if(sessionStorage.getItem('type') == 'empresa'){
        localButtons.innerHTML = `
            <li>
                <div class="nav_photo">
                    <a href="empresa-profile.html"><img src="assets/profile/default_avatar_empresa.jpeg"></a>
                </div>
            </li>
        `;
    }else if(sessionStorage.getItem('type') == 'usuario'){
        localButtons.innerHTML = `
            <li>
                <div class="nav_photo">
                    <a href="user-profile.html"><img src="assets/profile/default_avatar.webp"></a>
                </div>
            </li>
        `;
    }
}

const paraPerfil = () => {
    if(sessionStorage.getItem('type') == 'usuario'){
        window.location.href = 'user-profile.html';
    }else if(sessionStorage.getItem('type') == 'empresa'){
        window.location.href = 'empresa-profile.html';
    }
}

const paraLogin = () => {
    if(!sessionStorage.getItem('type')){
        window.location.href = 'login.html';
    }
}