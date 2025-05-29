const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");
const { authenticate, authorizeArticle } = require("../middlewares/auth");

// Ruta de búsqueda (colocada antes de /:id para evitar conflictos de rutas)
router.get("/search", articleController.searchArticles);

// Rutas públicas
router.get("/", articleController.getArticles);
router.get("/:id", articleController.getArticle);

// Rutas protegidas (redactores y admin)
router.post("/", authenticate, articleController.createArticle);
router.put(
  "/:id",
  authenticate,
  authorizeArticle,
  articleController.updateArticle
);
router.delete(
  "/:id",
  authenticate,
  authorizeArticle,
  articleController.deleteArticle
);

module.exports = router;
