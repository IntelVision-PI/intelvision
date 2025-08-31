let empresaController = require("../controllers/empresaController");
let express = require("express");
let router = express.Router();

router.post("/cadastrarUsuario", function (req, res) {
    empresaController.cadastrarUsuario(req, res);
})

router.post("/autenticar", function (req, res) {
    empresaController.autenticar(req, res);
});

module.exports = router;