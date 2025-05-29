const jwt = require("jsonwebtoken");

// Middleware para autenticar sesiones usando JWT
exports.authenticate = (req, res, next) => {
  // El header Authorization debe tener el formato: "Bearer <token>"
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res
      .status(401)
      .json({ error: "No proporcionado: se requiere un token" });
  }

  // Separamos el header para obtener el token
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res
      .status(401)
      .json({ error: "Formato de token inválido. Uso: Bearer <token>" });
  }

  const token = parts[1];

  // Verifica el token usando la clave secreta
  jwt.verify(token, "mysecretkey", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token inválido o expirado" });
    }
    // Si el token es válido, se asigna a req.user para usarlo en otros controladores
    req.user = decoded;
    next();
  });
};

// Middleware para autorizar la edición o eliminación de artículos.
// Permite a un admin o a un redactor (si es el autor del artículo) realizar la acción.
exports.authorizeArticle = async (req, res, next) => {
  const Article = require("../models/Article");
  try {
    const article = await Article.findById(req.params.id);
    if (!article)
      return res.status(404).json({ error: "Artículo no encontrado" });

    // Se permite si el rol es admin o si el redactor es quien creó el artículo.
    if (
      req.user.role === "admin" ||
      article.author.toString() === req.user._id
    ) {
      return next();
    }
    return res.status(403).json({ error: "Acceso denegado" });
  } catch (err) {
    console.error("Error en authorizeArticle:", err);
    return res.status(500).json({ error: "Error del servidor" });
  }
};

// Middleware para permitir modificaciones en comentarios.
// El administrador tiene permisos; el redactor solo si el comentario pertenece a un artículo suyo.
exports.authorizeCommentModification = async (req, res, next) => {
  const Comment = require("../models/Comment");
  const Article = require("../models/Article");
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment)
      return res.status(404).json({ error: "Comentario no encontrado" });

    // El administrador siempre tiene permiso
    if (req.user.role === "admin") return next();

    // Si es redactor, solo se permite si el artículo del comentario es suyo.
    if (req.user.role === "redactor") {
      const article = await Article.findById(comment.article);
      if (article && article.author.toString() === req.user._id) {
        return next();
      }
    }
    return res.status(403).json({ error: "Acceso denegado" });
  } catch (err) {
    console.error("Error en authorizeCommentModification:", err);
    return res.status(500).json({ error: "Error del servidor" });
  }
};
