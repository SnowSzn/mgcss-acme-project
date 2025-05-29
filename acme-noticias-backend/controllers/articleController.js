const Article = require("../models/Article");

// Listar todos los artículos
exports.getArticles = async (req, res) => {
  try {
    // Creamos un objeto filtro vacío.
    // Si se pasa el query parameter 'category', lo añadimos al filtro.
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Busca los articulos que pasen el filtro
    const articles = await Article.find(filter);
    // .populate('author')
    // .populate('category')
    res.json(articles);
  } catch (err) {
    console.error("Error buscando articulos:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
};

// Buscar artículos por palabra clave (en título o cuerpo)
exports.searchArticles = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const articles = await Article.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { body: { $regex: keyword, $options: "i" } },
      ],
    }).populate("author category");
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Error del servidor" });
  }
};

// Obtener un artículo en concreto
exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate(
      "author category"
    );
    if (!article)
      return res.status(404).json({ error: "Artículo no encontrado" });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: "Error del servidor" });
  }
};

// Crear artículo (solo para redactores autenticados)
exports.createArticle = async (req, res) => {
  try {
    const { title, body, category, coverImage, videoLinks } = req.body;
    const article = new Article({
      title,
      body,
      category,
      author: req.user._id,
      coverImage,
      videoLinks,
    });
    await article.save();
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ error: "Error del servidor" });
  }
};

// Actualizar artículo
exports.updateArticle = async (req, res) => {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedArticle)
      return res.status(404).json({ error: "Artículo no encontrado" });
    res.json(updatedArticle);
  } catch (err) {
    res.status(500).json({ error: "Error del servidor" });
  }
};

// Borrar artículo
exports.deleteArticle = async (req, res) => {
  try {
    const deleted = await Article.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Artículo no encontrado" });
    res.json({ message: "Artículo eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error del servidor" });
  }
};
