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

function deleteUsuario(idUsuario, idEmpresa){
    if (!idUsuario) {
        throw new Error("ID do usuário inválido");
    }

    if (!idEmpresa) {
        throw new Error("ID da empresa inválido");
    }

    return empresaModel.deleteUsuario(idUsuario, idEmpresa);
}

module.exports = {
    cadastrarUsuario,
    deleteUsuario
}