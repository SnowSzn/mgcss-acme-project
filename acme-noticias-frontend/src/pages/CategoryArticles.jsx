import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const CategoryArticles = () => {
  const { categoryId } = useParams();
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Se asume que el backend permite filtrar los artículos por categoría pasando un query parameter, por ejemplo:
    // GET /api/articles?category=<categoryId>
    fetch(`http://localhost:3000/api/articles?category=${categoryId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al obtener artículos");
        }
        return res.json();
      })
      .then((data) => setArticles(data))
      .catch((err) => {
        console.error("Error fetching articles:", err);
        setError(err.message);
      });
  }, [categoryId]);

  return (
    <div>
      <h2>Artículos en esta categoría</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {articles.length === 0 ? (
        <p>No hay artículos en esta categoría.</p>
      ) : (
        <ul>
          {articles.map((article) => (
            <li key={article._id}>
              <Link to={`/article/${article._id}`}>{article.title}</Link>
            </li>
          ))}
        </ul>
      )}
      <div
        style={{
          borderBottom: "1px solid #ccc",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      ></div>
      <p>
        <Link to="/categories">Volver a Categorías</Link>
      </p>
    </div>
  );
};

export default CategoryArticles;
