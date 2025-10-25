let servidorController = require("../controllers/servidorController");
let express = require("express");
let router = express.Router();

router.post("/cadastrarServidor", function (req, res) {
  servidorController.cadastrarServidor(req, res);
});

router.get("/select/servidor/:idEmpresa", function (req, res) {
  servidorController.obterServidores(req, res);
});



module.exports = router;