const database = require("../database/config");

function buscarParametro(idComponente) {
    let instrucaoSql = `
        SELECT s.nome AS servidor, c.nome AS componente, c.unidade_medida, em_risco_min AS risco_min, em_risco_max AS risco_max, alerta, s.tipo FROM parametro p
            INNER JOIN componente c ON c.id = p.fkComponente
            INNER JOIN servidor s ON s.id = p.fkServidor 
            INNER JOIN empresa e ON e.id = s.fkEmpresa
        WHERE c.id = ${idComponente};
    `;
    console.log(
        "Executando a instrução SQL (buscarParametro parametro): \n" + instrucaoSql
    );
    return database.executar(instrucaoSql);
}

function buscarTodos() {
    let instrucaoSql = `
        SELECT s.nome AS servidor, c.nome AS componente, c.unidade_medida, em_risco_min AS risco_min, em_risco_max AS risco_max, alerta, s.tipo FROM parametro p
            INNER JOIN componente c ON c.id = p.fkComponente
            INNER JOIN servidor s ON s.id = p.fkServidor 
            INNER JOIN empresa e ON e.id = s.fkEmpresa;
    `;
    console.log(
        "Executando a instrução SQL (buscarParametro parametro): \n" + instrucaoSql
    );
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarParametro,
    buscarTodos
};