const express = require("express");
const router = express.Router();
const predicaoController = require("../controllers/predicaoController");

router.get("/select", predicaoController.pegarServidores);

router.get("/:ano/:mes/:dia/:servidor", predicaoController.pegarDados);

module.exports = router;
