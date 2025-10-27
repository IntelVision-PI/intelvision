var database = require("../database/config");


function cadastrarServidor(
  nomeServidor,
  sistemaOperacional,
  macAddress,
  tipoServidor,
  modelo,
  serviceTag,
  fkEmpresa
) {
  let instrucaoSql = `
        INSERT INTO servidor 
        (
            nome, 
            sistema_operacional, 
            macaddress,
            tipo,
            modelo,
            service_tag,
            fkempresa
        ) 
        VALUES 
        (
            '${nomeServidor}', 
            '${sistemaOperacional}', 
            '${macAddress}', 
            '${tipoServidor}', 
            '${modelo}', 
            '${serviceTag}', 
            '${fkEmpresa}'
        );
    `;
  console.log(
    "Executando a instrução SQL (cadastro de servidor): \n" + instrucaoSql
  );

  return database.executar(instrucaoSql);

}

function cadastrarComponentes (
  nomeComponente,
  unidade_medida
) {
  let instrucaoSql = `
    INSERT INTO componente (nome, unidade_medida) 
        VALUES('${nomeComponente}','${unidade_medida}');
    `;
  console.log(
    "Executando a instrução SQL (cadastro dos componentes do servidor): \n" + instrucaoSql
  );

  return database.executar(instrucaoSql);
}


function cadastrarParametro(fkServidor, fkComponente, alerta_min, alerta_max) {
  let instrucaoSql = `
    INSERT INTO parametro (fkServidor, fkComponente, alerta_min, alerta_max)
    VALUES (${fkServidor}, ${fkComponente}, ${alerta_min}, ${alerta_max});
  `;

  console.log(
    "Executando a instrução SQL (cadastro de parâmetro do servidor): \n" + instrucaoSql
  );

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
  cadastrarServidor,
  obterServidores,
  cadastrarComponentes,
  cadastrarParametro
};