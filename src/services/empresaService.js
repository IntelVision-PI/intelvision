let empresaModel = require("../models/empresaModel");

function cadastrarUsuario(nomeUsuario, emailUsuario, senhaUsuario, fkEmpresa) {
    if (!nomeUsuario) {
        throw new Error("Nome de usuário inválido!");
    }

    if (!emailUsuario || !emailUsuario.includes('@')) {
        throw new Error("E-mail inválido!");
    }

    if (!senhaUsuario || senhaUsuario.length < 8) {
        throw new Error("Senha inválida!");
    }
    
    if (!fkEmpresa) {
        throw new Error("fkEmpresa inválida!");
    }

    return empresaModel.cadastrarUsuarioEmpresa(nomeUsuario, emailUsuario, senhaUsuario, fkEmpresa);
}

module.exports = {
    cadastrarUsuario
}