const express = require("express");
const router = express.Router();
const comparativoController = require("../controllers/comparativo");

router.get("/select", comparativoController.pegarServidores);

router.get("/:ano/:mes/:dia/:servidor", comparativoController.pegarDados);

router.get("/chamados", function(req, res){
    comparativoController.buscarChamadosS3(req, res)
});

module.exports = router;
