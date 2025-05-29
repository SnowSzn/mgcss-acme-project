const Category = require("../models/Category");

// Listar categorías
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Error del servidor" });
  }
};

// Crear categoría (admin)
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: "Error del servidor" });
  }
};

// Actualizar categoría (admin)
exports.updateCategory = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCategory)
      return res.status(404).json({ error: "Categoría no encontrada" });
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ error: "Error del servidor" });
  }
};

// Eliminar categoría (admin)
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Categoría no encontrada" });
    res.json({ message: "Categoría eliminada" });
  } catch (err) {
    res.status(500).json({ error: "Error del servidor" });
  }
};
