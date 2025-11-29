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
        INSERT INTO servidor (nome, sistema_operacional, macaddress, tipo, modelo, service_tag, fkempresa) 
        VALUES ('${nomeServidor}', '${sistemaOperacional}', '${macAddress}', '${tipoServidor}', '${modelo}', '${serviceTag}', '${fkEmpresa}');
    `;
  console.log(
    "Executando a instrução SQL (cadastro de servidor): \n" + instrucaoSql
  );
  return database.executar(instrucaoSql);
}

function cadastrarComponentes(nomeComponente, unidade_medida) {
  let instrucaoSql = `
        INSERT INTO componente (nome, unidade_medida) 
        VALUES('${nomeComponente}','${unidade_medida}');
    `;
  console.log(
    "Executando a instrução SQL (cadastro componentes): \n" + instrucaoSql
  );
  return database.executar(instrucaoSql);
}

function cadastrarParametro(fkServidor, fkComponente, alerta_min, alerta_max) {
  let instrucaoSql = `
        INSERT INTO parametro (fkServidor, fkComponente, alerta_min, alerta_max)
        VALUES (${fkServidor}, ${fkComponente}, ${alerta_min}, ${alerta_max});
    `;
  console.log(
    "Executando a instrução SQL (cadastro parametro): \n" + instrucaoSql
  );
  return database.executar(instrucaoSql);
}

function obterServidores(idEmpresa) {
  var instrucaoSql = `
        SELECT id, nome, sistema_operacional, macaddress, tipo, modelo, service_tag 
        FROM servidor WHERE fkEmpresa = ${idEmpresa};
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarServidorPorId(idServidor) {
  var instrucaoSql = `SELECT * FROM servidor WHERE id = ${idServidor}`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function atualizarServidor(idServidor, nome, modelo, so, tipo) {
  var instrucaoSql = `
        UPDATE servidor 
        SET nome = '${nome}', 
            modelo = '${modelo}', 
            sistema_operacional = '${so}', 
            tipo = '${tipo}' 
        WHERE id = ${idServidor};
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarParametrosPorIdServidor(idServidor) {
  var instrucaoSql = `
        SELECT 
            c.nome as componente,
            p.em_risco_min,
            p.alerta,
            p.em_risco_max
        FROM parametro p
        INNER JOIN componente c ON p.fkComponente = c.id
        WHERE p.fkServidor = ${idServidor};
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function atualizarParametros(idServidor, dados) {
  // Função para tratar valores vazios, se vier vazio retorna a string "NULL" para o SQL
  const tratar = (valor) => {
    if (valor === "" || valor === undefined || valor === null) {
      return "NULL";
    }
    return valor;
  };

  var sqlCPU = `
        UPDATE parametro SET 
            em_risco_min = ${tratar(dados.cpu_risco_min)},
            alerta = ${tratar(dados.cpu_alerta)},
            em_risco_max = ${tratar(dados.cpu_risco_max)}
        WHERE fkServidor = ${idServidor} 
        AND fkComponente = (SELECT id FROM componente WHERE nome = 'CPU');
    `;

  var sqlRAM = `
        UPDATE parametro SET 
            em_risco_min = ${tratar(dados.ram_risco_min)},
            alerta = ${tratar(dados.ram_alerta)},
            em_risco_max = ${tratar(dados.ram_risco_max)}
        WHERE fkServidor = ${idServidor} 
        AND fkComponente = (SELECT id FROM componente WHERE nome = 'RAM');
    `;

  var sqlDisco = `
        UPDATE parametro SET 
            em_risco_min = ${tratar(dados.disco_risco_min)},
            alerta = ${tratar(dados.disco_alerta)},
            em_risco_max = ${tratar(dados.disco_risco_max)}
        WHERE fkServidor = ${idServidor} 
        AND fkComponente = (SELECT id FROM componente WHERE nome = 'HD');
    `;

  return database
    .executar(sqlCPU)
    .then(() => database.executar(sqlRAM))
    .then(() => database.executar(sqlDisco));
}

function obterServidoresCodecs(idEmpresa) {
  var instrucaoSql = `
      SELECT 
      servidor.id, 
      servidor.nome, 
      servidor.sistema_operacional, 
      servidor.macaddress, 
      servidor.tipo, 
      servidor.modelo, 
      servidor.service_tag,
      componente.unidade_medida as codec
      FROM servidor 
      INNER JOIN parametro ON parametro.fkServidor = servidor.id 
      INNER JOIN componente ON parametro.fkComponente = componente.id
      WHERE servidor.fkEmpresa = ${idEmpresa}
      AND parametro.fkComponente >= 4;
  
      `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  cadastrarServidor,
  obterServidores,
  cadastrarComponentes,
  cadastrarParametro,
  buscarServidorPorId,
  atualizarServidor,
  buscarParametrosPorIdServidor,
  atualizarParametros,
  obterServidoresCodecs,
};
