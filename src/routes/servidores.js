let servidorController = require("../controllers/servidorController");
let express = require("express");
let router = express.Router();

router.post("/cadastrarServidor", function (req, res) {
  servidorController.cadastrarServidor(req, res);
});

module.exports = router;