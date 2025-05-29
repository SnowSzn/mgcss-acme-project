const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate } = require("../middlewares/auth");

// GET /api/users
// Obtiene la lista de usuarios
router.get("/", authenticate, userController.getUsers);

// POST /api/users
// Crea un nuevo usuario
router.post("/", authenticate, userController.createUser);

// PUT /api/users/:id
// Actualiza un usuario
router.put("/:id", authenticate, userController.updateUser);

// DELETE /api/users/:id
// Elimina un usuario
router.delete("/:id", authenticate, userController.deleteUser);

module.exports = router;
