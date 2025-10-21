var database = require("../database/config");


function cadastrarServidor(
  nomeServidor,
  sistemaOperacional,
  macAddress,
  tipoServidor,
  fkEmpresa
) {
  let instrucaoSql = `
        INSERT INTO servidor 
        (
            nome, 
            sistema_operacional, 
            macaddress,
            tipo, 
            fkempresa
        ) 
        VALUES 
        (
            '${nomeServidor}', 
            '${sistemaOperacional}', 
            '${macAddress}', 
            '${tipoServidor}', 
            '${fkEmpresa}'
        );
    `;
  console.log(
    "Executando a instrução SQL (cadastro de usuário): \n" + instrucaoSql
  );
  return database.executar(instrucaoSql);
}


module.exports = {
  cadastrarServidor
};