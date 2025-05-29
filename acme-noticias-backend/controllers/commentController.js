const Comment = require("../models/Comment");
const Article = require("../models/Article");

// GET /api/comments?article=<articleId>
// Devuelve los comentarios filtrados por artículo (si se pasa el query parameter)
exports.getComments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.article) {
      filter.article = req.query.article;
    }

    // Opción: populate para obtener información del autor (nombre y rol)
    const comments = await Comment.find(filter).populate(
      "author",
      "username role"
    );

    res.json(comments);
  } catch (err) {
    console.error("Error al obtener comentarios:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
};

// POST /api/comments
// Permite que cualquier usuario autenticado comente en un artículo.
exports.createComment = async (req, res) => {
  try {
    const { article, text } = req.body;
    if (!article || !text) {
      return res
        .status(400)
        .json({ error: "Se requieren artículo y texto para el comentario" });
    }

    // Verificar que el artículo existe
    const foundArticle = await Article.findById(article);
    if (!foundArticle) {
      return res.status(404).json({ error: "Artículo no encontrado" });
    }

    // Si se desactivó los comentarios lanzar error.
    if (foundArticle.commentsDisabled) {
      return res.status(403).json({
        error: "Los comentarios están desactivados para este artículo",
      });
    }

    // Se asume que req.user viene del middleware de autenticación
    const comment = new Comment({
      article,
      author: req.user._id,
      text,
    });
    await comment.save();

    // Populate el campo "author" para obtener el username y role
    await comment.populate("author", "username role");

    res.status(201).json(comment);
  } catch (err) {
    console.error("Error al crear comentario:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
};

// PUT /api/comments/:id
// Actualiza un comentario.
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedComment) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }
    res.json(updatedComment);
  } catch (err) {
    console.error("Error al actualizar comentario:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
};

// DELETE /api/comments/:id
// Elimina un comentario
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }
    res.json({ message: "Comentario eliminado satisfactoriamente" });
  } catch (err) {
    console.error("Error al eliminar comentario:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
};
