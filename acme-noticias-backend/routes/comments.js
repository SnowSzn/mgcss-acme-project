const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const {
  authenticate,
  authorizeCommentModification,
} = require("../middlewares/auth");

// GET /api/comments?article=<articleId>
router.get("/", commentController.getComments);

// POST /api/comments
// Cualquier usuario autenticado puede comentar
router.post("/", authenticate, commentController.createComment);

// PUT /api/comments/:id
// Actualiza un comentario (el middleware autoriza basándose en permisos)
router.put(
  "/:id",
  authenticate,
  authorizeCommentModification,
  commentController.updateComment
);

// DELETE /api/comments/:id
// Elimina un comentario
router.delete(
  "/:id",
  authenticate,
  authorizeCommentModification,
  commentController.deleteComment
);

module.exports = router;
