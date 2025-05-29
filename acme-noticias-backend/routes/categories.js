const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { authenticate } = require("../middlewares/auth");

// Middleware para acceso solo a administradores
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  res.status(403).json({ error: "Solo admin autorizado" });
};

// Ruta pública para obtener categorías
router.get("/", categoryController.getCategories);

// Rutas protegidas para gestión de categorías (admin)
router.post("/", authenticate, adminOnly, categoryController.createCategory);
router.put("/:id", authenticate, adminOnly, categoryController.updateCategory);
router.delete(
  "/:id",
  authenticate,
  adminOnly,
  categoryController.deleteCategory
);

module.exports = router;
