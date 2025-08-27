let usuarioModel = require("../models/usuarioModel");

function cadastrarUsuario(nomeUsuario, emailUsuario, senhaUsuario, codigoAtivacao) {
    if (!nomeUsuario) {
        throw new Error("Nome de usuário inválido!");
    }

    if (!emailUsuario || !emailUsuario.includes('@')) {
        throw new Error("E-mail inválido!");
    }

    if (!senhaUsuario || senhaUsuario.length < 8) {
        throw new Error("Senha inválida!");
    }
    
    if (!codigoAtivacao) {
        throw new Error("fkEmpresa inválida!");
    }

    return usuarioModel.cadastrarUsuario(nomeUsuario, emailUsuario, senhaUsuario, codigoAtivacao);
}

module.exports = {
    cadastrarUsuario
}