let usuarioController = require("../controllers/usuarioController");
let express = require("express");
let router = express.Router();

router.post("/cadastrarUsuario", function (req, res) {
    usuarioController.cadastrarUsuario(req, res);
})

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
})

router.put("/atualizarCadastro", function(req, res){
    usuarioController.atualizarCadastro(req, res);
});

router.delete("/excluirUsuario", function(req,res){
    usuarioController.excluirUsuario(req,res)
})

router.get("/retornaTodosOsUsuariosDaEmpresa/:usuarioId/:empresaId", function(req, res) {
    usuarioController.retornaTodosOsUsuariosDaEmpresa(req, res);
})

router.put('/atualizaSenhaDoUsuario', function(req, res){
    usuarioController.atualizaSenhaDoUsuario(req, res)
})

router.put("/atualizaNomeDoUsuario", function(req, res){
    usuarioController.atualizaNomeDoUsuario(req, res)
})

router.put("/atualizaEmailDoUsuario", function(req, res){
    usuarioController.atualizaEmailDoUsuario(req, res)
})

router.delete("/removerUsuario", function(req, res){
    usuarioController.removerUsuario(req, res)
})

module.exports = router;