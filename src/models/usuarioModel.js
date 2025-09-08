var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT id, nome, email, fkEmpresa as empresaId FROM usuario WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrarUsuario(nomeUsuario, emailUsuario, senhaUsuario, codigoAtivacao) {

    let pegaid = `select id from empresa where codigo_ativacao = '${codigoAtivacao}';`
    return database.executar(pegaid)
        .then(resultado => {
            if (resultado.length != 0) {
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
            }
        });
}

function atualizarCadastro(id, nome, email, senha){
    let atualiza=`update usuario set nome ='${nome}', email ='${email}', senha ='${senha}' where id =${id};`;
   console.log("Executando a instrução de alualizar: \n"+atualiza)
    return database.executar(atualiza)
}

function excluirUsuario(id){
    let excluir = `delete from usuario where id = ${id}`
    console.log("Executando a instrução de alualizar: \n" + excluir)
     return database.executar(excluir)
}

function retornaTodosOsUsuariosDaEmpresa(id, fkEmpresa) {
    let retornarTodosOsUsuariosDaEmpresa = `SELECT id, nome, email FROM usuario WHERE id != ${id} && fkEmpresa = ${fkEmpresa}`;
    console.log("Executando a instrução SQL (retornar todos os usuários da empresa): \n" + retornarTodosOsUsuariosDaEmpresa)
    return database.executar(retornarTodosOsUsuariosDaEmpresa)
}

async function atualizaSenhaDoUsuario(idUsuario, senhaAtual, senhaNova) {
    var instrucaoSql = `
        SELECT 1 FROM usuario WHERE id = ${idUsuario} AND senha = '${senhaAtual}'
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    const result = await database.executar(instrucaoSql);

    if (result.length != 0) {
        instrucaoSql = `
            UPDATE usuario SET senha = '${senhaNova}' WHERE id = ${idUsuario}
        `;

        return database.executar(instrucaoSql)
    }
    return result;
}

function atualizaNomeDoUsuario(id, nome) {
    var instrucaoSql = `
        UPDATE usuario SET nome = '${nome}' where id=${id}
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizaEmailDoUsuario(id, email) {
    var instrucaoSql = `
        UPDATE usuario SET email = '${email}' WHERE id = ${id}
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function removerUsuario(id) {
    var instrucaoSql = `
        DELETE FROM usuario WHERE id = ${id}
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrarUsuario,
    atualizarCadastro,
    excluirUsuario,
    retornaTodosOsUsuariosDaEmpresa,
    atualizaSenhaDoUsuario,
    atualizaNomeDoUsuario,
    atualizaEmailDoUsuario,
    removerUsuario
};