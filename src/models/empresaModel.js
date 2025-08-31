var database = require("../database/config")

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

module.exports = {
    cadastrarUsuarioEmpresa
};
