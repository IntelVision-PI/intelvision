var database = require("../database/config");

function autenticarEmpresa(email, senha) {
  console.log(
    "ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ",
    email,
    senha
  );
  var instrucaoSql = `
        SELECT id, nome, email, codigo_ativacao FROM empresa WHERE email = '${email}' AND senha = '${senha}';
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function cadastrarUsuarioEmpresa(
  nomeUsuario,
  emailUsuario,
  senhaUsuario,
  fkEmpresa
) {
  let instrucaoSql = `
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
  console.log(
    "Executando a instrução SQL (cadastro de usuário): \n" + instrucaoSql
  );
  return database.executar(instrucaoSql);
}

function deleteUsuario(idUsuario, idEmpresa) {
  var instrucaoSql = `
        DELETE FROM usuario where id=${idUsuario} and fkEmpresa=${idEmpresa}
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function deleteEmpresa(idEmpresa) {
  var instrucaoSql = `
        DELETE FROM empresa where id=${idEmpresa}
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function atualizarNomeEmpresa(idEmpresa, nome) {
  var instrucaoSql = `
        UPDATE empresa SET nome = '${nome}' where id=${idEmpresa}
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function atualizarEmailEmpresa(idEmpresa, email) {
  var instrucaoSql = `
        UPDATE empresa SET email = '${email}' where id=${idEmpresa}
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

async function atualizarSenhaEmpresa(idEmpresa, senhaAtual, senhaNova) {
  var instrucaoSql = `
        select 1 from empresa where id=${idEmpresa} and senha='${senhaAtual}'
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  const result = await database.executar(instrucaoSql);

  if (result.length != 0) {
    instrucaoSql = `
            update empresa set senha = '${senhaNova}' where id = ${idEmpresa}
        `;

    return database.executar(instrucaoSql);
  }
  return result;
}

function atualizarUsuarioEmpresa(idUsuario, idEmpresa, nome, email, senha) {
  if (senha) {
    var instrucaoSql = `
            UPDATE usuario SET email = '${email}', nome='${nome}', senha='${senha}' where fkEmpresa=${idEmpresa} and id = ${idUsuario}
        `;
  } else {
    var instrucaoSql = `
            UPDATE usuario SET email = '${email}', nome='${nome}' where fkEmpresa=${idEmpresa} and id = ${idUsuario}
        `;
  }
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function obterUsuarios(idEmpresa) {
  var instrucaoSql = `
        select id, nome, email from usuario where fkEmpresa = ${idEmpresa}
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function obterServidores(idEmpresa) {
  var instrucaoSql = `
        select id, nome, sistema_operacional, macaddress, tipo from servidor where fkEmpresa = ${idEmpresa}
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  autenticarEmpresa,
  cadastrarUsuarioEmpresa,
  deleteUsuario,
  deleteEmpresa,
  atualizarNomeEmpresa,
  atualizarEmailEmpresa,
  atualizarSenhaEmpresa,
  atualizarUsuarioEmpresa,
  obterUsuarios,
  obterServidores,
};
