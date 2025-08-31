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

function deleteUsuario(idUsuario, idEmpresa) {
    if (!idUsuario) {
        throw new Error("ID do usuário inválido");
    }

    if (!idEmpresa) {
        throw new Error("ID da empresa inválido");
    }

    return empresaModel.deleteUsuario(idUsuario, idEmpresa);
}

function deleteEmpresa(idEmpresa) {
    if (!idEmpresa) {
        throw new Error("ID da empresa inválido");
    }

    return empresaModel.deleteEmpresa(idEmpresa);
}

function atualizarNomeEmpresa(idEmpresa, nome) {
    if (!idEmpresa) {
        throw new Error("ID da empresa inválido");
    }

    if(!nome){
        throw new Error("Nome inválido");
    }

    return empresaModel.atualizarNomeEmpresa(idEmpresa, nome);
}

function atualizarEmailEmpresa(idEmpresa, email){
    if (!idEmpresa) {
        throw new Error("ID da empresa inválido");
    }

    if(!email || !email.includes("@")){
        throw new Error("Email inválido");
    }

    return empresaModel.atualizarEmailEmpresa(idEmpresa, email);
}

module.exports = {
    cadastrarUsuario,
    deleteUsuario,
    deleteEmpresa,
    atualizarNomeEmpresa,
    atualizarEmailEmpresa
}