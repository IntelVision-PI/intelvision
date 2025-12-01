const express = require("express");
var router = express.Router();
var situacaoController = require("../controllers/situacaoController");

router.get("/buscarParametro/:idEmpresa", function(req, res){
    situacaoController.buscarParametro(req, res)
})

router.get("/buscarTodos", function(req, res){
    situacaoController.buscarTodos(req, res)
})

module.exports = router;