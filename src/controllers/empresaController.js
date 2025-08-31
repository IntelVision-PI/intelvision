let empresaService = require("../services/empresaService");
let empresaModel = require("../models/empresaModel");

function autenticar(req, res) {
    var email = req.body.email;
    var senha = req.body.senha;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        empresaModel.autenticarEmpresa(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`);

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);
                        res.json({
                            id: resultadoAutenticar[0].id,
                            email: resultadoAutenticar[0].email,
                            nome: resultadoAutenticar[0].nome,
                            senha: resultadoAutenticar[0].senha,
                            codigo: resultadoAutenticar[0].codigo_ativacao
                        });
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function cadastrarUsuario(req, res) {
    let nomeUsuario = req.body.nome;
    let emailUsuario = req.body.email;
    let senhaUsuario = req.body.senha;
    let fkEmpresa = req.body.fkEmpresa;

    empresaService.cadastrarUsuario(nomeUsuario, emailUsuario, senhaUsuario, fkEmpresa)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao realizar o cadastro! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function deleteUsuario(req, res) {
    const idUsuario = req.body.userID;
    const idEmpresa = req.body.empresaID;

    empresaService.deleteUsuario(idUsuario, idEmpresa)
        .then(
            function (resultado) {
                if(resultado.affectedRows == 0){
                    return res.json({ "message": "usuário não encontrado" })
                }
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao deletar! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function deleteEmpresa(req, res){
    const idEmpresa = req.body.empresaID;

    empresaService.deleteEmpresa(idEmpresa)
        .then(
            function (resultado) {
                if(resultado.affectedRows == 0){
                    return res.json({ "message": "empresa não encontrada" })
                }
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao deletar! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}

module.exports = {
    autenticar,
    cadastrarUsuario,
    deleteUsuario,
    deleteEmpresa
}