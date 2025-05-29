const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Inicia sesión con el usuario dado
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Busca el usuario en la base de datos
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    // Compara la contraseña
    if (user.password !== password) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Genera el token con los datos necesarios
    const token = jwt.sign(
      { _id: user._id, username: user.username, role: user.role },
      "mysecretkey" // clave secreta para testear
    );

    res.json({
      token,
      user: { _id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
