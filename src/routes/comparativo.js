const express = require("express");
const router = express.Router();

const { pegarDados } = require("../controllers/comparativo");

router.get("/:ano/:mes/:dia/:servidor", pegarDados);

module.exports = router;
