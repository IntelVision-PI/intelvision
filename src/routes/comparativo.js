const express = require("express");
const router = express.Router();
const comparativoController = require("../controllers/comparativo");

router.get("/select", comparativoController.pegarServidores);

router.get("/:ano/:mes/:dia/:servidor", comparativoController.pegarDados);

module.exports = router;
