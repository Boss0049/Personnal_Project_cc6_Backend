const express = require("express");
const Controller = require("../controllers/article");
const passport = require("passport");
const router = express.Router();

const auth = passport.authenticate("personal-auth", { session: false });

router.get("/", auth, Controller.getArticleAll);
router.get("/me", auth, Controller.getArticleOwner);
router.get("/popular", auth, Controller.getArticlePopular);
router.get("/:id", auth, Controller.getArticleOne);
router.post("/", auth, Controller.createArticle);
router.post("/upload", Controller.uploadImage);
router.delete("/:id", auth, Controller.deleteArticle);
router.patch("/view/:id", auth, Controller.updateView);
router.patch("/status/:id", auth, Controller.statusPrivate);
router.patch("/:id", auth, Controller.updateArticle);

module.exports = router;
