var database = require("../database/config");


function cadastrarServidor(
  nomeServidor,
  sistemaOperacional,
  macAddress,
  tipoServidor,
  modelo,
  serviceTag,
  atividade,
  quantDisco,
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
            atividade,
            quantDisco,
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
            '${atividade}', 
            '${quantDisco}', 
            '${fkEmpresa}'
        );
    `;
  console.log(
    "Executando a instrução SQL (cadastro de servidor): \n" + instrucaoSql
  );

  // let instrucaoSql =  `
  //     INSERT INTO componente (nome, unidade_medida, descricao, fkServidor)
  //     VALUES ('${c.nome}', '${c.unidade_medida}', '${c.descricao}', ${idServidor});
  //`;


  // return database.executar(instrucaoSql)
  //   .then(resultado => {
  //     const idServidor = resultado.insertId; // pega o ID do servidor recém-criado
  //     console.log("Servidor cadastrado com ID:", idServidor);

  //     let insertsComponentes = componentes.map(c => `
  //       INSERT INTO componente (nome, unidade_medida, descricao, fkServidor)
  //       VALUES ('${c.nome}', '${c.unidade_medida}', '${c.descricao}', ${idServidor});
  //     `);

  //     const promessas = insertsComponentes.map(sql => database.executar(sql));

  //     return Promise.all(promessas);
  //   });
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
  obterServidores
};