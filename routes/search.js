const express = require("express");
const router = require("./user");
const app = express.Router();
const Controller = require("../controllers/search");

router.get("/", Controller.searchKeyword);
router.get("/category", Controller.searchCategory);

module.exports = router;
