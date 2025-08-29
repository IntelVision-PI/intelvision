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

router.delete("/excluirCadastro", function(req,res){
    usuarioController.excluirCadastro(req,res)
})

module.exports = router;