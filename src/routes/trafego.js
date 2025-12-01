var express = require("express");
var router = express.Router();

// AQUI ESTAVA O ERRO: Ele tentava importar o controller e não achava
var trafegoController = require("../controllers/trafego");

router.get("/servidores", function (req, res) {
    trafegoController.buscarServidores(req, res);
});

router.get("/:ano/:mes/:dia/:servidor", function (req, res) {
    trafegoController.buscarDados(req, res);
});

module.exports = router;