import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const MyArticles = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Obtén el usuario y el token almacenados
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || !user) {
      setError("No estás autenticado");
      return;
    }

    // Realizamos el fetch para obtener todos los artículos
    fetch("http://localhost:3000/api/articles", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        return res.json();
      })
      .then((data) => {
        // Si el usuario es admin se muestran todos los artículos, de lo contrario filtramos solo los del autor.
        if (user.role === "admin") {
          setArticles(data);
        } else {
          const myArticles = data.filter((article) => {
            let authorId = article.author;
            if (typeof authorId === "object" && authorId !== null) {
              authorId = authorId._id;
            }
            return authorId === user._id;
          });
          setArticles(myArticles);
        }
      })
      .catch((err) => {
        console.error("Error fetching articles:", err);
        setError("Error al obtener tus artículos");
      });
  }, [token, user]);

  const deleteArticle = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este artículo?")) {
      fetch(`http://localhost:3000/api/articles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error al eliminar");
          return res.json();
        })
        .then(() => {
          // Actualizamos el estado eliminando el artículo borrado.
          setArticles((prevArticles) =>
            prevArticles.filter((article) => article._id !== id)
          );
        })
        .catch((err) => {
          console.error("Error deleting article:", err);
          setError("Error al eliminar el artículo");
        });
    }
  };

  return (
    <div>
      <h2>Mis Artículos</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* Enlace para crear un nuevo artículo */}
      <button onClick={() => navigate(`/create-article`)}>
        Crear Nuevo Artículo
      </button>
      <br></br>
      <br></br>
      <div
        style={{ borderBottom: "1px solid #ccc", marginBottom: "20px" }}
      ></div>
      {articles.length === 0 ? (
        <p>No hay artículos disponibles.</p>
      ) : (
        <ul>
          {articles.map((article) => (
            <li key={article._id}>
              <Link to={`/article/${article._id}`}>{article.title}</Link> &nbsp;
              <button onClick={() => navigate(`/edit-article/${article._id}`)}>
                Editar
              </button>
              <button onClick={() => deleteArticle(article._id)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyArticles;
