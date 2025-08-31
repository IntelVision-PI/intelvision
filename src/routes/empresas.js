let empresaController = require("../controllers/empresaController");
let express = require("express");
let router = express.Router();

router.post("/cadastrarUsuario", function (req, res) {
    empresaController.cadastrarUsuario(req, res);
})

module.exports = router;