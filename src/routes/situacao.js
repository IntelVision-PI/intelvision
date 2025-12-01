const express = require("express");
const router = express.Router();

var situacaoController = require("../controllers/situacaoController");

router.get("/select", function(req, res){
    situacaoController.buscarDadosS3(req, res)
});

router.get("/chamados", function(req, res){
    situacaoController.buscarChamadosS3(req, res)
});

router.get("/buscarParametro/:idEmpresa", function(req, res){
    situacaoController.buscarParametros(req, res)
})

module.express = router;