let usuarioService = require("../services/usuarioService");
let usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.email;
    var senha = req.body.senha;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);

                        // aquarioModel.buscarAquariosPorEmpresa(resultadoAutenticar[0].empresaId)
                        //     .then((resultadoAquarios) => {
                        //         if (resultadoAquarios.length > 0) {
                        res.json({
                            id: resultadoAutenticar[0].id,
                            empresaId: resultadoAutenticar[0].empresaId,
                            email: resultadoAutenticar[0].email,
                            nome: resultadoAutenticar[0].nome,
                            senha: resultadoAutenticar[0].senha
                        });
                        // } else {
                        //     res.status(204).json({ aquarios: [] });
                        // }
                        //})
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
    let codigoAtivacao = req.body.codigoAtivacao;

    usuarioService.cadastrarUsuario(nomeUsuario, emailUsuario, senhaUsuario, codigoAtivacao)
        .then(
            function (resultado) {
                if (!resultado) {
                    return res.status(403).json({ "message": "codigo invalido" })
                }
                res.json(resultado.data);
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

function atualizarCadastro(req, res) {
    let id = req.body.id;
    let nome = req.body.nome;
    let email = req.body.email;
    let senha = req.body.senha;

    usuarioModel.atualizarCadastro(id, nome, email, senha)
        .then(
            function (resultadoAtualizar) {
                res.json(resultadoAtualizar);
                console.log("Atualização realizada com sucesso!")
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao atualizar as informações! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );

}

function excluirUsuario(req, res) {
    let id = req.body.id;

    if (id == undefined) {
        res.status(400).send("O id do usuário está indefinido");
    } else {
        usuarioModel.excluirUsuario(id)
            .then(
                function (resultadoExcluir) {
                    res.json(resultadoExcluir);
                    console.log("Usuário excluído com sucesso!");
                }
            )
            .catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao excluir o usuário! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function retornaTodosOsUsuariosDaEmpresa(req, res) {

    const id = req.params.usuarioId;
    const fkEmpresa = req.params.empresaId;

    usuarioModel.retornaTodosOsUsuariosDaEmpresa(id, fkEmpresa)
        .then(
            function (resultado) {
                return res.json(resultado);
            }
        )
        .catch(function erro() {
            console.log(erro);
            console.log(
                "\nHouve um erro ao buscar! Erro: ",
                erro.sqlMessage
            );
            res.status(500).json(erro.sqlMessage);
        })
}

function atualizaSenhaDoUsuario(req, res) {
    const id = req.body.idUsuario;
    const senhaAtual = req.body.senhaAtual;
    const senhaNova = req.body.senhaNova;

    usuarioService.atualizaSenhaDoUsuario(id, senhaAtual, senhaNova)
        .then(
            function (resultado) {
                if (resultado.length == 0) {
                    return res.status(403).json({ "message": "senha inválida" })
                }
                if (resultado.affectedRows == 0) {
                    return res.status(401).json({ "message": "usuário não encontrado" })
                }
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao editar! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function atualizaNomeDoUsuario(req, res) {
    const id = req.body.id;
    const nome = req.body.nome;

    usuarioService.atualizaNomeDoUsuario(id, nome)
        .then(
            function (resultado) {
                if (resultado.affectedRows == 0) {
                    return res.json({ "message": "usuário não encontrada" })
                }
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao editar! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function atualizaEmailDoUsuario(req, res) {
    const id = req.body.id;
    const email = req.body.email;

    usuarioService.atualizaEmailDoUsuario(id, email)
        .then(
            function (resultado) {
                if (resultado.affectedRows == 0) {
                    return res.json({ "message": "usuário não encontrada" })
                }
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao editar! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function removerUsuario(req, res) {
    const id = req.body.id;

    usuarioService.removerUsuario(id)
        .then(
            function (resultado) {
                if (resultado.affectedRows == 0) {
                    return res.json({ "message": "usuário não encontrada" })
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
    atualizarCadastro,
    excluirUsuario,
    retornaTodosOsUsuariosDaEmpresa,
    atualizaSenhaDoUsuario,
    atualizaNomeDoUsuario,
    atualizaEmailDoUsuario,
    removerUsuario
}