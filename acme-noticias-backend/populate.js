const mongoose = require("mongoose");

// Importa los modelos
const User = require("./models/User");
const Category = require("./models/Category");
const Article = require("./models/Article");
const Comment = require("./models/Comment");

async function seedDB() {
  try {
    // Conecta a la base de datos (por defecto de MongoDB)
    await mongoose.connect("mongodb://127.0.0.1:27017/acme_noticias", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectado a la base de datos");

    // Elimina datos existentes para evitar duplicados
    await User.deleteMany({});
    await Category.deleteMany({});
    await Article.deleteMany({});
    await Comment.deleteMany({});

    // Crear usuarios de ejemplo
    const admin = await User.create({
      username: "admin",
      password: "admin123",
      role: "admin",
    });

    const redactor1 = await User.create({
      username: "redactor1",
      password: "redactor123",
      role: "redactor",
    });

    const redactor2 = await User.create({
      username: "redactor2",
      password: "redactor123",
      role: "redactor",
    });

    const reader1 = await User.create({
      username: "reader1",
      password: "reader123",
      role: "reader",
    });

    console.log("Usuarios creados");

    // Crear categorías de ejemplo
    const categoriesData = [
      { name: "Nacional", description: "Noticias nacionales" },
      { name: "Internacional", description: "Noticias internacionales" },
      { name: "Ciencia", description: "Avances y descubrimientos en ciencia" },
      { name: "Deportes", description: "Cobertura de eventos deportivos" },
      { name: "Cultura", description: "Noticias de espectáculos y arte" },
    ];

    const categories = await Category.insertMany(categoriesData);
    console.log("Categorías creadas");

    // Crear artículos de ejemplo usando el redactor1 como autor
    const articlesData = [
      {
        title: "Avances en la ciencia en 2025",
        body: "El mundo científico ha dado pasos agigantados en el año 2025, revolucionando la biotecnología y la medicina regenerativa...",
        category: categories.find((cat) => cat.name === "Ciencia")._id,
        author: redactor1._id,
        coverImage:
          "https://www.verx.com.br/wp-content/uploads/2025/02/scientist-and-humanoid-ai-robot-in-the-science-lab-2025-01-08-14-27-11-utc-scaled.jpg",
        videoLinks: ["https://www.youtube.com/watch?v=Fn3311WBG-o"],
      },
      {
        title: "El gran torneo internacional de fútbol arranca hoy",
        body: "Equipos de todo el mundo se reúnen para competir en el torneo internacional, prometiendo un espectáculo inolvidable...",
        category: categories.find((cat) => cat.name === "Deportes")._id,
        author: redactor1._id,
      },
      {
        title: "Debate de candidatos en las elecciones nacionales",
        body: "En un ambiente electoral tenso, los candidatos expusieron sus propuestas y respondieron a preguntas del público...",
        category: categories.find((cat) => cat.name === "Nacional")._id,
        author: redactor2._id,
      },
    ];

    const articles = await Article.insertMany(articlesData);
    console.log("Artículos creados");

    // Crear comentarios de ejemplo
    const commentsData = [
      {
        article: articles[0]._id,
        author: reader1._id,
        text: "Gran artículo, muy informativo.",
      },
      {
        article: articles[0]._id,
        author: redactor1._id,
        text: "Gracias por compartir tu opinión.",
      },
      {
        article: articles[1]._id,
        author: reader1._id,
        text: "Espero ver más detalles sobre el torneo.",
      },
    ];

    await Comment.insertMany(commentsData);
    console.log("Comentarios creados");
  } catch (err) {
    console.error("Error al seedear la base de datos:", err);
  } finally {
    await mongoose.connection.close();
    console.log("Conexión cerrada");
  }
}

seedDB();
