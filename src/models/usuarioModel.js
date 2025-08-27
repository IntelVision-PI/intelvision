var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT id, nome, email, fk_empresa as empresaId FROM usuario WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrarUsuario(nomeUsuario, emailUsuario, senhaUsuario, codigoAtivacao) {
    
    let pegaid = `select id from empresa where codigo_ativacao = '${codigoAtivacao}';`
    return database.executar(pegaid)
    .then(resultado => {
        if(resultado === 0){
            throw new Error("Erro de código")
        }

        const fkEmpresa = resultado[0].id

    
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
    });
}

module.exports = {
    autenticar,
    cadastrarUsuario
};