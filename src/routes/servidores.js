var express = require("express");
var router = express.Router();
var servidorController = require("../controllers/servidorController");

router.post("/cadastrarServidor", function (req, res) {
  servidorController.cadastrarServidor(req, res);
});

router.post("/cadastrarComponentes", function (req, res) {
  servidorController.cadastrarComponentes(req, res);
});

router.post("/cadastrarParametro", function (req, res) {
  servidorController.cadastrarParametro(req, res);
});

router.get("/select/servidor/:idEmpresa", function (req, res) {
  servidorController.obterServidores(req, res);
});

router.get("/buscar/:idServidor", function (req, res) {
  servidorController.buscarServidorPorId(req, res);
});

router.put("/atualizar/:idServidor", function (req, res) {
  servidorController.atualizarServidor(req, res);
});

router.get("/buscarParametros/:idServidor", function (req, res) {
  servidorController.buscarParametros(req, res);
});

router.put("/atualizarParametros/:idServidor", function (req, res) {
  servidorController.atualizarParametros(req, res);
});

router.get("/select/servidorCodecs/:idEmpresa", function (req, res) {
  servidorController.obterServidoresCodecs(req, res);
});

module.exports = router;
