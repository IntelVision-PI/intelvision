var database = require("../database/config")

function autenticarEmpresa(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT id, nome, email, codigo_ativacao FROM empresa WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrarUsuarioEmpresa(nomeUsuario, emailUsuario, senhaUsuario, fkEmpresa) {
    let instrucaoSql =
        `
        INSERT INTO usuario 
        (
            nome, 
            email, 
            senha, 
            fkempresa
        ) 
        VALUES 
        (
            '${nomeUsuario}', 
            '${emailUsuario}', 
            '${senhaUsuario}', 
            '${fkEmpresa}'
        );
    `;
    console.log("Executando a instrução SQL (cadastro de usuário): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deleteUsuario(idUsuario, idEmpresa) {
    var instrucaoSql = `
        DELETE FROM usuario where id=${idUsuario} and fkEmpresa=${idEmpresa}
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticarEmpresa,
    cadastrarUsuarioEmpresa,
    deleteUsuario
};
