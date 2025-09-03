const logout = document.getElementById('logout');

logout.addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = 'login.html';
})