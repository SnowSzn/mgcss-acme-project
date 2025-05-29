const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Rutas de la API
const articlesRoutes = require("./routes/articles");
const categoriesRoutes = require("./routes/categories");
const commentsRoutes = require("./routes/comments");
const dashboardRoutes = require("./routes/dashboard");
const usersRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

const app = express();

// Middleware para procesar JSON y URLs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Habilitar CORS (opcional, pero recomendable para pruebas con front-end en otro puerto)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Conexión a MongoDB (ajusta la cadena de conexión según tu configuración)
mongoose
  .connect("mongodb://127.0.0.1:27017/acme_noticias", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar MongoDB:", err));

// Registro de rutas API
app.use("/api/articles", articlesRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", usersRoutes);
app.use("/api", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
