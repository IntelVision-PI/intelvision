let empresaController = require("../controllers/empresaController");
let express = require("express");
let router = express.Router();

router.post("/cadastrarUsuario", function (req, res) {
    empresaController.cadastrarUsuario(req, res);
})

router.post("/autenticar", function (req, res) {
    empresaController.autenticar(req, res);
});

router.delete("/deletar/usuario", function(req, res){
    empresaController.deleteUsuario(req, res);
})

router.delete("/deletar/empresa", function(req, res){
    empresaController.deleteEmpresa(req, res)
})

router.put("/atualizar/empresa/nome", function(req, res){
    empresaController.atualizarNomeEmpresa(req, res)
})

module.exports = router;