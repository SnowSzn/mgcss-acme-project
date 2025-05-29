const Article = require("../models/Article");
const Comment = require("../models/Comment");

// GET /api/dashboard
// Obtiene los datos para el dashboard de los administradores
exports.getDashboardData = async (req, res) => {
  try {
    // Calcular el número medio de comentarios
    const articles = await Article.find();
    const articleIds = articles.map((a) => a._id);
    const comments = await Comment.find({ article: { $in: articleIds } });

    let totalComments = comments.length;
    let avgComments = articles.length
      ? (totalComments / articles.length).toFixed(2)
      : 0;

    // Agrupar comentarios por artículo
    const commentCountMap = {};
    comments.forEach((c) => {
      const id = c.article.toString();
      commentCountMap[id] = (commentCountMap[id] || 0) + 1;
    });

    // Ordenar artículos por número de comentarios descendente
    const topArticles = articles
      .map((article) => ({
        _id: article._id,
        title: article.title,
        commentCount: commentCountMap[article._id.toString()] || 0,
      }))
      .sort((a, b) => b.commentCount - a.commentCount);

    res.json({ avgComments, topArticles });
  } catch (err) {
    console.error("Error en el dashboard:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
};
