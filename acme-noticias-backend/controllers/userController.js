const User = require("../models/User");

// GET /api/users
// Obtiene la lista de todos los usuarios
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
};

// POST /api/users
// Crea un nuevo usuario
exports.createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = new User({ username, password, role });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error("Error al crear usuario:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
};

// PUT /api/users/:id
// Actualiza un usuario existente
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Obtiene los datos del cuerpo de la petición
    // Si la password se deja en blanco no se cambiará
    const updateData = req.body;

    // Actualizamos y devolvemos el nuevo objeto (opción { new: true })
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Error al actualizar usuario:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
};

// DELETE /api/users/:id
// Borra un usuario existente
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado satisfactoriamente" });
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
};
